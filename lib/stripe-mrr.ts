import type Stripe from "stripe";

// Pure math, deliberately free of "server-only" and Next.js imports so it can
// run under `node --test` directly (ARCHITECTURE §8: Stripe servisine unit test).

export type MonthlyAmount = { cents: number; currency: string };

const WEEKS_PER_MONTH = 52 / 12;
const DAYS_PER_MONTH = 365 / 12;

function itemMonthlyCents(item: Stripe.SubscriptionItem): number {
  const price = item.price;
  if (!price?.recurring) return 0;

  // MRR-7 (accepted, by design): tiered/metered prices have no flat unit_amount
  // and their true MRR depends on usage we don't have at accept time, so we
  // deliberately count them as 0 rather than guess. This can undercount
  // saved_mrr_cents for usage-based plans — a known reporting limitation, not a
  // security issue.
  const unitAmount = price.unit_amount ?? 0;
  const quantity = item.quantity ?? 1;
  const total = unitAmount * quantity;

  const count = price.recurring.interval_count || 1;
  switch (price.recurring.interval) {
    case "month":
      return total / count;
    case "year":
      return total / (12 * count);
    case "week":
      return (total * WEEKS_PER_MONTH) / count;
    case "day":
      return (total * DAYS_PER_MONTH) / count;
    default:
      return 0;
  }
}

/**
 * Normalizes a subscription's current recurring total to a monthly amount in
 * cents — the MRR retained when a cancellation is saved. Gross of any existing
 * discounts: what we "save" is the subscription continuing to exist.
 */
export function computeMonthlyAmountCents(subscription: Stripe.Subscription): MonthlyAmount {
  const cents = subscription.items.data.reduce((sum, item) => sum + itemMonthlyCents(item), 0);
  return { cents: Math.round(cents), currency: subscription.currency };
}
