import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { applyOfferToCustomer, createProjectStripeClient } from "@/lib/stripe";
import type { Offer } from "@/lib/types";
import { authenticateWidgetRequest, corsHeaders, resolveOpenSession } from "@/lib/widget-auth";

type AcceptBody = { sessionToken?: string };

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

/**
 * Applies the session's offer on the *project owner's* Stripe account and
 * records the retained MRR. Any failure leaves the session "open" and returns
 * a structured error — the widget renders its graceful error state and the
 * host site is never broken (PRD: we never cancel, never 500 blindly).
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const origin = request.headers.get("origin");
  const key = request.nextUrl.searchParams.get("key");
  const { id } = await params;

  const auth = await authenticateWidgetRequest(key, origin);
  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.reason },
      { status: auth.reason === "invalid_key" ? 401 : 403, headers: corsHeaders(origin) },
    );
  }

  let body: AcceptBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_json" },
      { status: 400, headers: corsHeaders(origin) },
    );
  }

  const session = await resolveOpenSession(auth.project, id, body.sessionToken);
  if (!session) {
    return NextResponse.json(
      { error: "session_not_found" },
      { status: 404, headers: corsHeaders(origin) },
    );
  }

  if (!session.offer_id) {
    return NextResponse.json(
      { error: "no_offer" },
      { status: 409, headers: corsHeaders(origin) },
    );
  }
  if (!session.customer_id) {
    // Widget was opened without a Stripe customer id — we can't act on the
    // subscription, so the visitor is routed to the graceful error state.
    return NextResponse.json(
      { error: "no_customer" },
      { status: 409, headers: corsHeaders(origin) },
    );
  }

  const supabase = createServiceClient();

  // GDPR-2/PAY-3: at most one retention discount per (project, customer).
  // Refuse BEFORE touching Stripe so an attacker can't loop create→accept to
  // stack coupons and drive a subscription toward $0. The partial unique index
  // cancel_sessions_one_save_per_customer is the atomic backstop for races.
  const { data: priorSave, error: priorErr } = await supabase
    .from("cancel_sessions")
    .select("id")
    .eq("project_id", auth.project.id)
    .eq("customer_id", session.customer_id)
    .eq("outcome", "saved")
    .limit(1)
    .maybeSingle();
  if (priorErr) {
    console.error("[cancelkit] prior-save lookup failed:", priorErr.message);
    return NextResponse.json(
      { error: "lookup_failed" },
      { status: 500, headers: corsHeaders(origin) },
    );
  }
  if (priorSave) {
    return NextResponse.json(
      { error: "already_saved" },
      { status: 409, headers: corsHeaders(origin) },
    );
  }

  const { data: offerRow, error: offerRowErr } = await supabase
    .from("offers")
    .select("*")
    .eq("id", session.offer_id)
    .eq("project_id", auth.project.id)
    .maybeSingle();
  if (offerRowErr) {
    console.error("[cancelkit] offer lookup failed:", offerRowErr.message);
    return NextResponse.json(
      { error: "lookup_failed" },
      { status: 500, headers: corsHeaders(origin) },
    );
  }
  if (!offerRow) {
    return NextResponse.json(
      { error: "no_offer" },
      { status: 409, headers: corsHeaders(origin) },
    );
  }

  const client = createProjectStripeClient(auth.project);
  if (!client.ok) {
    return NextResponse.json(
      { error: client.reason },
      { status: 409, headers: corsHeaders(origin) },
    );
  }

  const applied = await applyOfferToCustomer(
    client.stripe,
    offerRow as Offer,
    session.customer_id,
    session.id,
  );
  if (!applied.ok) {
    return NextResponse.json(
      { error: applied.reason },
      { status: applied.reason === "unsupported_offer" ? 409 : 502, headers: corsHeaders(origin) },
    );
  }

  // The discount is now LIVE on the customer's Stripe subscription. Record it,
  // transitioning only from "open" (PAY-3: no double-processing of a session
  // another request already resolved).
  const { error } = await supabase
    .from("cancel_sessions")
    .update({
      outcome: "saved",
      saved_mrr_cents: applied.savedMrrCents,
      currency: applied.currency,
      resolved_at: new Date().toISOString(),
    })
    .eq("id", session.id)
    .eq("outcome", "open");

  if (error) {
    // PAY-1: Stripe already applied the offer — we must NEVER tell the customer
    // "your subscription was not changed" (which the widget would record as
    // churned). Log the DB desync loudly for reconciliation and report the
    // truth: the save succeeded.
    console.error(
      "[cancelkit] offer applied on Stripe but DB write failed (reconcile):",
      session.id,
      error.message,
    );
  }

  return NextResponse.json(
    { outcome: "saved", savedMrrCents: applied.savedMrrCents, currency: applied.currency },
    { status: 200, headers: corsHeaders(origin) },
  );
}
