// Lemon Squeezy webhook helpers — pure module (node:crypto only, no
// server-only imports) so signature verification is directly unit-testable.

import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/**
 * Verifies a Lemon Squeezy X-Signature header: hex-encoded HMAC-SHA256 of the
 * raw request body with the webhook secret. Timing-safe comparison.
 *
 * PAY-5: LS signatures carry no timestamp/nonce (unlike Stripe's t=,v1=), so
 * the signature alone offers no replay freshness. Replay is instead neutralized
 * by the webhook_events idempotency table in the route — a resent payload has
 * the same event id and is acknowledged without being reprocessed.
 */
export function verifyLsSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature || !secret) return false;
  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest();
  let received: Buffer;
  try {
    received = Buffer.from(signature, "hex");
  } catch {
    return false;
  }
  if (received.length !== expected.length) return false;
  return timingSafeEqual(received, expected);
}

export type LsWebhookPayload = {
  meta?: {
    event_name?: string;
    webhook_id?: string;
    custom_data?: Record<string, unknown>;
  };
  data?: {
    type?: string;
    id?: string;
    attributes?: Record<string, unknown>;
  };
};

/**
 * Stable idempotency key for a webhook delivery. Prefers the LS-provided
 * webhook_id; falls back to a hash of the raw body (LS retries resend the
 * identical payload, so the hash is stable across retries).
 */
export function lsEventId(payload: LsWebhookPayload, rawBody: string): string {
  const webhookId = payload.meta?.webhook_id;
  if (typeof webhookId === "string" && webhookId.length > 0) return `ls_${webhookId}`;
  return `sha256_${createHash("sha256").update(rawBody, "utf8").digest("hex")}`;
}
