import { customAlphabet } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { isSessionCreateRateLimited } from "@/lib/rate-limit";
import {
  authenticateWidgetRequest,
  corsHeaders,
  resolveOwnerBillingState,
} from "@/lib/widget-auth";
import type { Offer } from "@/lib/types";

const generateSessionToken = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  40,
);

type CreateSessionBody = {
  reasonId?: string;
  reasonText?: string;
  customerId?: string;
  customerEmail?: string;
};

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const key = request.nextUrl.searchParams.get("key");

  const auth = await authenticateWidgetRequest(key, origin);
  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.reason },
      { status: auth.reason === "invalid_key" ? 401 : 403, headers: corsHeaders(origin) },
    );
  }

  // Config is edge-cached for 5 minutes, so a just-expired trial can still
  // have a live widget holding a cached config; this gate closes that window.
  const billing = await resolveOwnerBillingState(auth.project);
  if (!billing.widgetEnabled) {
    return NextResponse.json(
      { error: "subscription_inactive" },
      { status: 403, headers: corsHeaders(origin) },
    );
  }

  let body: CreateSessionBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_json" },
      { status: 400, headers: corsHeaders(origin) },
    );
  }

  // GDPR-2: throttle session creation per (project, customer) so a scripted
  // caller can't spam sessions to probe reasons or drive discount attempts.
  if (await isSessionCreateRateLimited(auth.project.id, body.customerId)) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: corsHeaders(origin) },
    );
  }

  const supabase = createServiceClient();

  if (body.reasonId) {
    const { data: reason, error: reasonError } = await supabase
      .from("survey_reasons")
      .select("id")
      .eq("id", body.reasonId)
      .eq("project_id", auth.project.id)
      .maybeSingle();
    // ERR-1: a DB failure must not be silently reported as "invalid reason".
    if (reasonError) {
      console.error("[cancelkit] reason lookup failed:", reasonError.message);
      return NextResponse.json(
        { error: "lookup_failed" },
        { status: 500, headers: corsHeaders(origin) },
      );
    }
    if (!reason) {
      return NextResponse.json(
        { error: "invalid_reason" },
        { status: 400, headers: corsHeaders(origin) },
      );
    }
  }

  const { data: topOffer, error: offerError } = await supabase
    .from("offers")
    .select("*")
    .eq("project_id", auth.project.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle<Offer>();

  // ERR-1: distinguish a transient DB error from "no offer configured" —
  // returning offer:null on a DB blip would let the widget churn a customer
  // whose retention offer simply failed to load.
  if (offerError) {
    console.error("[cancelkit] offer lookup failed:", offerError.message);
    return NextResponse.json(
      { error: "lookup_failed" },
      { status: 500, headers: corsHeaders(origin) },
    );
  }

  const sessionToken = generateSessionToken();

  const { data: session, error } = await supabase
    .from("cancel_sessions")
    .insert({
      project_id: auth.project.id,
      session_token: sessionToken,
      customer_id: body.customerId ?? null,
      customer_email: body.customerEmail ?? null,
      reason_id: body.reasonId ?? null,
      reason_text: body.reasonText?.slice(0, 2000) ?? null,
      offer_id: topOffer?.id ?? null,
      outcome: "open",
    })
    .select("id")
    .single();

  if (error || !session) {
    return NextResponse.json(
      { error: "session_create_failed" },
      { status: 500, headers: corsHeaders(origin) },
    );
  }

  return NextResponse.json(
    {
      sessionId: session.id,
      sessionToken,
      offer: topOffer
        ? {
            id: topOffer.id,
            type: topOffer.type,
            headline: topOffer.headline,
            percentOff: topOffer.percent_off,
            durationMonths: topOffer.duration_months,
            pauseMonths: topOffer.pause_months,
          }
        : null,
    },
    { status: 201, headers: corsHeaders(origin) },
  );
}
