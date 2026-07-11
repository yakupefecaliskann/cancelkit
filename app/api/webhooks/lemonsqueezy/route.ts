import { NextRequest, NextResponse } from "next/server";
import { lsStatusToSubscriptionStatus } from "@/lib/billing";
import { lsEventId, verifyLsSignature, type LsWebhookPayload } from "@/lib/ls-webhook";
import { createServiceClient } from "@/lib/supabase/service";

// Lemon Squeezy → our billing state. Server-to-server only (no CORS), signed
// with LEMONSQUEEZY_WEBHOOK_SECRET. Uses the service-role client on purpose:
// there is no user session here and profiles RLS would block the update.

const PG_UNIQUE_VIOLATION = "23505";

export async function POST(request: NextRequest) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[ls-webhook] LEMONSQUEEZY_WEBHOOK_SECRET is not set.");
    return NextResponse.json({ error: "webhook_not_configured" }, { status: 500 });
  }

  // Signature is computed over the raw bytes — read text before parsing.
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");
  if (!verifyLsSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  let payload: LsWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const eventName = payload.meta?.event_name ?? "unknown";
  const eventId = lsEventId(payload, rawBody);
  const supabase = createServiceClient();

  // Idempotency claim: the event id is the primary key, so a retry (or a
  // concurrent duplicate delivery) fails the insert and is acknowledged
  // without being processed twice.
  const { error: claimError } = await supabase.from("webhook_events").insert({
    id: eventId,
    source: "lemonsqueezy",
    type: eventName,
    payload,
  });
  if (claimError) {
    if (claimError.code === PG_UNIQUE_VIOLATION) {
      return NextResponse.json({ received: true, duplicate: true });
    }
    console.error("[ls-webhook] Failed to record event:", claimError.message);
    return NextResponse.json({ error: "event_store_failed" }, { status: 500 });
  }

  try {
    await processEvent(payload, eventName);
    return NextResponse.json({ received: true });
  } catch (err) {
    // Release the idempotency claim so Lemon Squeezy's retry can reprocess.
    await supabase.from("webhook_events").delete().eq("id", eventId);
    console.error(`[ls-webhook] Processing ${eventName} failed:`, err);
    return NextResponse.json({ error: "processing_failed" }, { status: 500 });
  }
}

/** Parses an LS ISO timestamp (e.g. attributes.updated_at); null if absent/invalid. */
function parseLsTimestamp(value: unknown): Date | null {
  if (typeof value !== "string" || value.length === 0) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function processEvent(payload: LsWebhookPayload, eventName: string): Promise<void> {
  // Only subscription lifecycle events change our billing state; everything
  // else (order_created, subscription_payment_*, ...) is logged and ignored.
  if (!eventName.startsWith("subscription_") || payload.data?.type !== "subscriptions") return;

  const attributes = payload.data.attributes ?? {};
  const lsStatus = typeof attributes.status === "string" ? attributes.status : null;
  const subscriptionId = payload.data.id;
  if (!lsStatus || !subscriptionId) {
    throw new Error("subscription event missing data.id or attributes.status");
  }

  const supabase = createServiceClient();
  const userId = await resolveUserId(payload, attributes);
  if (!userId) {
    // Untraceable subscription (no custom user_id and no email match). Retrying
    // won't help, so acknowledge — the stored payload allows manual repair.
    console.warn(`[ls-webhook] ${eventName}: could not resolve a profile, skipping.`);
    return;
  }

  // Load the current billing row to (a) reject out-of-order deliveries and
  // (b) track when the account first entered past_due.
  const { data: current } = await supabase
    .from("profiles")
    .select("subscription_status, ls_last_event_at, past_due_since")
    .eq("id", userId)
    .maybeSingle<{
      subscription_status: string;
      ls_last_event_at: string | null;
      past_due_since: string | null;
    }>();

  // PAY-2: webhook providers don't guarantee ordering under retries. If this
  // event predates the last one we applied, ignore it — a stale "active" must
  // not resurrect an account we already locked.
  const eventAt = parseLsTimestamp(attributes.updated_at);
  if (eventAt && current?.ls_last_event_at) {
    if (eventAt.getTime() <= new Date(current.ls_last_event_at).getTime()) {
      console.warn(`[ls-webhook] ${eventName}: stale event ignored (out of order).`);
      return;
    }
  }

  const newStatus = lsStatusToSubscriptionStatus(lsStatus);
  // Stamp past_due_since when the account enters past_due; preserve it while it
  // stays past_due; clear it otherwise. computeBillingState escalates to locked
  // once this exceeds the grace window (PAY-6).
  const pastDueSince =
    newStatus === "past_due"
      ? current?.subscription_status === "past_due" && current?.past_due_since
        ? current.past_due_since
        : new Date().toISOString()
      : null;

  const { error } = await supabase
    .from("profiles")
    .update({
      subscription_status: newStatus,
      ls_subscription_id: String(subscriptionId),
      ls_customer_id: attributes.customer_id != null ? String(attributes.customer_id) : null,
      ls_last_event_at: (eventAt ?? new Date()).toISOString(),
      past_due_since: pastDueSince,
    })
    .eq("id", userId);

  if (error) throw new Error(`profiles update failed: ${error.message}`);
}

/**
 * The checkout embeds our user id as custom data (see lib/lemonsqueezy.ts);
 * the customer's email is the fallback for events that lost it.
 */
async function resolveUserId(
  payload: LsWebhookPayload,
  attributes: Record<string, unknown>,
): Promise<string | null> {
  const supabase = createServiceClient();

  const customUserId = payload.meta?.custom_data?.user_id;
  if (typeof customUserId === "string" && customUserId.length > 0) {
    const { data } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", customUserId)
      .maybeSingle();
    if (data) return data.id;
  }

  const email = attributes.user_email;
  if (typeof email === "string" && email.length > 0) {
    const { data } = await supabase.from("profiles").select("id").eq("email", email).maybeSingle();
    if (data) return data.id;
  }

  return null;
}
