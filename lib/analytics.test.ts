import assert from "node:assert/strict";
import { test } from "node:test";
import {
  sumSavedCents,
  computeSaveRate,
  computeMonthlyTrend,
  computeReasonBreakdown,
} from "./analytics.ts";

test("sumSavedCents only counts saved outcomes", () => {
  const sessions = [
    { outcome: "saved" as const, saved_mrr_cents: 1000 },
    { outcome: "saved" as const, saved_mrr_cents: 2000 },
    { outcome: "churned" as const, saved_mrr_cents: null },
    { outcome: "open" as const, saved_mrr_cents: null },
  ];
  assert.equal(sumSavedCents(sessions), 3000);
});

test("computeSaveRate is null with no decided sessions", () => {
  const sessions = [{ outcome: "open" as const }, { outcome: "abandoned" as const }];
  assert.equal(computeSaveRate(sessions), null);
});

test("computeSaveRate ignores abandoned/open, counts saved vs churned", () => {
  const sessions = [
    { outcome: "saved" as const },
    { outcome: "saved" as const },
    { outcome: "churned" as const },
    { outcome: "abandoned" as const },
    { outcome: "open" as const },
  ];
  assert.equal(computeSaveRate(sessions), 2 / 3);
});

test("computeMonthlyTrend buckets saved cents by resolved_at month, oldest first", () => {
  const now = new Date(Date.UTC(2026, 6, 15)); // 2026-07-15
  const sessions = [
    { outcome: "saved" as const, saved_mrr_cents: 500, resolved_at: "2026-07-01T00:00:00Z" },
    { outcome: "saved" as const, saved_mrr_cents: 700, resolved_at: "2026-06-15T00:00:00Z" },
    { outcome: "saved" as const, saved_mrr_cents: 999, resolved_at: "2026-01-01T00:00:00Z" },
    { outcome: "churned" as const, saved_mrr_cents: null, resolved_at: "2026-07-01T00:00:00Z" },
    { outcome: "saved" as const, saved_mrr_cents: 100, resolved_at: null },
  ];
  const trend = computeMonthlyTrend(sessions, 3, now);
  assert.deepEqual(
    trend.map((p) => [p.monthKey, p.savedCents]),
    [
      ["2026-05", 0],
      ["2026-06", 700],
      ["2026-07", 500],
    ],
  );
});

test("computeReasonBreakdown groups by reason label and sorts descending", () => {
  const sessions = [
    { reason: { label: "Too expensive" } },
    { reason: { label: "Too expensive" } },
    { reason: { label: "Missing features" } },
    { reason: null, reason_text: "something custom" },
    { reason: null, reason_text: null },
  ];
  assert.deepEqual(computeReasonBreakdown(sessions), [
    { label: "Too expensive", count: 2 },
    { label: "Missing features", count: 1 },
    { label: "Other (free text)", count: 1 },
    { label: "No reason given", count: 1 },
  ]);
});

test("computeReasonBreakdown respects topN", () => {
  const sessions = [
    { reason: { label: "A" } },
    { reason: { label: "B" } },
    { reason: { label: "C" } },
  ];
  assert.equal(computeReasonBreakdown(sessions, 2).length, 2);
});
