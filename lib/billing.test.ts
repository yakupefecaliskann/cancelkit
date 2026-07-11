import assert from "node:assert/strict";
import { test } from "node:test";
import { createHmac } from "node:crypto";
import { computeBillingState, lsStatusToSubscriptionStatus } from "./billing.ts";
import { lsEventId, verifyLsSignature } from "./ls-webhook.ts";

const NOW = new Date("2026-07-11T12:00:00Z");

function state(subscription_status: Parameters<typeof computeBillingState>[0]["subscription_status"], trial_ends_at: string) {
  return computeBillingState({ subscription_status, trial_ends_at }, NOW);
}

test("active subscription is pro: no badge, widget enabled", () => {
  assert.deepEqual(state("active", "2026-01-01T00:00:00Z"), {
    plan: "pro",
    trialDaysLeft: 0,
    showBadge: false,
    widgetEnabled: true,
  });
});

test("trial with time left: badge shown, days rounded up", () => {
  const result = state("trialing", "2026-07-21T18:00:00Z"); // 10 days + 6h
  assert.equal(result.plan, "trial");
  assert.equal(result.trialDaysLeft, 11);
  assert.equal(result.showBadge, true);
  assert.equal(result.widgetEnabled, true);
});

test("trial ending later today still counts as 1 day left", () => {
  const result = state("trialing", "2026-07-11T13:30:00Z");
  assert.equal(result.plan, "trial");
  assert.equal(result.trialDaysLeft, 1);
});

test("expired trial locks: widget disabled", () => {
  const result = state("trialing", "2026-07-11T11:59:59Z");
  assert.deepEqual(result, { plan: "locked", trialDaysLeft: 0, showBadge: true, widgetEnabled: false });
});

test("trial ending exactly now locks", () => {
  assert.equal(state("trialing", NOW.toISOString()).plan, "locked");
});

test("unparseable trial_ends_at fails closed (locked)", () => {
  assert.equal(state("trialing", "not-a-date").plan, "locked");
});

test("cancelled locks the widget", () => {
  const result = state("cancelled", "2026-12-01T00:00:00Z");
  assert.equal(result.plan, "locked");
  assert.equal(result.widgetEnabled, false);
});

test("past_due keeps the widget running (dunning grace)", () => {
  const result = state("past_due", "2026-01-01T00:00:00Z");
  assert.equal(result.plan, "past_due");
  assert.equal(result.widgetEnabled, true);
  assert.equal(result.showBadge, false);
});

test("past_due within the grace window still serves the widget", () => {
  const result = computeBillingState(
    { subscription_status: "past_due", trial_ends_at: "2026-01-01T00:00:00Z", past_due_since: "2026-07-01T00:00:00Z" },
    NOW, // 10 days past_due < 30-day grace
  );
  assert.equal(result.plan, "past_due");
  assert.equal(result.widgetEnabled, true);
});

test("past_due beyond the grace window escalates to locked", () => {
  const result = computeBillingState(
    { subscription_status: "past_due", trial_ends_at: "2026-01-01T00:00:00Z", past_due_since: "2026-05-01T00:00:00Z" },
    NOW, // ~71 days past_due > 30-day grace
  );
  assert.equal(result.plan, "locked");
  assert.equal(result.widgetEnabled, false);
});

test("LS status mapping", () => {
  assert.equal(lsStatusToSubscriptionStatus("active"), "active");
  assert.equal(lsStatusToSubscriptionStatus("on_trial"), "active");
  // cancelled-at-period-end keeps Pro until subscription_expired arrives
  assert.equal(lsStatusToSubscriptionStatus("cancelled"), "active");
  assert.equal(lsStatusToSubscriptionStatus("expired"), "cancelled");
  assert.equal(lsStatusToSubscriptionStatus("past_due"), "past_due");
  assert.equal(lsStatusToSubscriptionStatus("unpaid"), "past_due");
  assert.equal(lsStatusToSubscriptionStatus("paused"), "past_due");
  // unknown future statuses fail soft, never hard-lock a paying customer
  assert.equal(lsStatusToSubscriptionStatus("some_new_status"), "past_due");
});

test("webhook signature: valid hex HMAC accepted", () => {
  const body = JSON.stringify({ meta: { event_name: "subscription_created" } });
  const sig = createHmac("sha256", "whsec_test").update(body, "utf8").digest("hex");
  assert.equal(verifyLsSignature(body, sig, "whsec_test"), true);
});

test("webhook signature: wrong secret, tampered body, malformed/missing sig rejected", () => {
  const body = '{"a":1}';
  const sig = createHmac("sha256", "secret").update(body, "utf8").digest("hex");
  assert.equal(verifyLsSignature(body, sig, "other-secret"), false);
  assert.equal(verifyLsSignature('{"a":2}', sig, "secret"), false);
  assert.equal(verifyLsSignature(body, "zz-not-hex", "secret"), false);
  assert.equal(verifyLsSignature(body, null, "secret"), false);
  assert.equal(verifyLsSignature(body, sig, ""), false);
});

test("event id prefers meta.webhook_id, falls back to body hash", () => {
  assert.equal(lsEventId({ meta: { webhook_id: "abc-123" } }, "{}"), "ls_abc-123");
  const a = lsEventId({}, '{"x":1}');
  const b = lsEventId({}, '{"x":1}');
  const c = lsEventId({}, '{"x":2}');
  assert.equal(a, b);
  assert.notEqual(a, c);
  assert.ok(a.startsWith("sha256_"));
});
