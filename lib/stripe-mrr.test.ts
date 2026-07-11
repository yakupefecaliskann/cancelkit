import assert from "node:assert/strict";
import { test } from "node:test";
import type Stripe from "stripe";
import { computeMonthlyAmountCents } from "./stripe-mrr.ts";

type ItemSpec = {
  unitAmount: number | null;
  quantity?: number;
  interval?: Stripe.Price.Recurring.Interval;
  intervalCount?: number;
  recurring?: boolean;
};

function fakeSubscription(currency: string, items: ItemSpec[]): Stripe.Subscription {
  return {
    currency,
    items: {
      data: items.map((spec) => ({
        quantity: spec.quantity,
        price: {
          unit_amount: spec.unitAmount,
          recurring:
            spec.recurring === false
              ? null
              : {
                  interval: spec.interval ?? "month",
                  interval_count: spec.intervalCount ?? 1,
                },
        },
      })),
    },
  } as unknown as Stripe.Subscription;
}

test("simple monthly price", () => {
  const sub = fakeSubscription("usd", [{ unitAmount: 4900 }]);
  assert.deepEqual(computeMonthlyAmountCents(sub), { cents: 4900, currency: "usd" });
});

test("quantity multiplies, missing quantity defaults to 1", () => {
  const sub = fakeSubscription("usd", [
    { unitAmount: 1000, quantity: 3 },
    { unitAmount: 500 },
  ]);
  assert.equal(computeMonthlyAmountCents(sub).cents, 3500);
});

test("yearly price is divided by 12", () => {
  const sub = fakeSubscription("eur", [{ unitAmount: 12000, interval: "year" }]);
  assert.deepEqual(computeMonthlyAmountCents(sub), { cents: 1000, currency: "eur" });
});

test("every-3-months billing is divided by interval_count", () => {
  const sub = fakeSubscription("usd", [{ unitAmount: 3000, intervalCount: 3 }]);
  assert.equal(computeMonthlyAmountCents(sub).cents, 1000);
});

test("weekly price uses 52/12 weeks per month", () => {
  const sub = fakeSubscription("usd", [{ unitAmount: 1200, interval: "week" }]);
  assert.equal(computeMonthlyAmountCents(sub).cents, Math.round((1200 * 52) / 12));
});

test("daily price uses 365/12 days per month", () => {
  const sub = fakeSubscription("usd", [{ unitAmount: 100, interval: "day" }]);
  assert.equal(computeMonthlyAmountCents(sub).cents, Math.round((100 * 365) / 12));
});

test("metered price without unit_amount contributes 0", () => {
  const sub = fakeSubscription("usd", [
    { unitAmount: null },
    { unitAmount: 2900 },
  ]);
  assert.equal(computeMonthlyAmountCents(sub).cents, 2900);
});

test("non-recurring item contributes 0", () => {
  const sub = fakeSubscription("usd", [
    { unitAmount: 9900, recurring: false },
    { unitAmount: 2900 },
  ]);
  assert.equal(computeMonthlyAmountCents(sub).cents, 2900);
});

test("fractional result rounds to whole cents", () => {
  // $10/year → 83.33.. cents/month → 83
  const sub = fakeSubscription("usd", [{ unitAmount: 1000, interval: "year" }]);
  assert.equal(computeMonthlyAmountCents(sub).cents, 83);
});
