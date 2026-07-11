// Billing state derivation — pure module (no server-only imports) so it is
// directly unit-testable, same pattern as lib/stripe-mrr.ts / lib/analytics.ts.

export type SubscriptionStatus = "trialing" | "active" | "past_due" | "cancelled";

export type BillingProfile = {
  subscription_status: SubscriptionStatus;
  trial_ends_at: string;
  /** When the account entered past_due; null unless currently past_due. Optional
   *  for callers/tests that don't track it — absence just means "no escalation". */
  past_due_since?: string | null;
};

export type BillingPlan = "trial" | "pro" | "past_due" | "locked";

export type BillingState = {
  plan: BillingPlan;
  /** Whole days until the trial ends (ceil); 0 unless plan === "trial". */
  trialDaysLeft: number;
  /** "Powered by CancelKit" badge in the widget — shown unless the owner pays. */
  showBadge: boolean;
  /** When false the widget config API answers 403 and the widget never opens. */
  widgetEnabled: boolean;
};

const DAY_MS = 24 * 60 * 60 * 1000;
/** How long an account may stay past_due before we stop serving the widget.
 *  Backstops the fail-soft mapping so a non-paying account can't keep Pro
 *  forever if Lemon Squeezy never emits a terminal expired/unpaid event. */
export const PAST_DUE_GRACE_DAYS = 30;

export function computeBillingState(profile: BillingProfile, now: Date = new Date()): BillingState {
  switch (profile.subscription_status) {
    case "active":
      return { plan: "pro", trialDaysLeft: 0, showBadge: false, widgetEnabled: true };
    case "past_due": {
      // Lemon Squeezy is still dunning (retrying the card). Keep the widget
      // running so a billing hiccup never breaks the customer's site; the
      // dashboard shows a warning. subscription_expired flips this to locked.
      // Local escalation backstop: if the account has been past_due beyond the
      // grace window, stop serving the widget even without an LS terminal event.
      if (profile.past_due_since) {
        const daysPastDue = (now.getTime() - new Date(profile.past_due_since).getTime()) / DAY_MS;
        if (daysPastDue > PAST_DUE_GRACE_DAYS) {
          return { plan: "locked", trialDaysLeft: 0, showBadge: true, widgetEnabled: false };
        }
      }
      return { plan: "past_due", trialDaysLeft: 0, showBadge: false, widgetEnabled: true };
    }
    case "cancelled":
      return { plan: "locked", trialDaysLeft: 0, showBadge: true, widgetEnabled: false };
    case "trialing": {
      const msLeft = new Date(profile.trial_ends_at).getTime() - now.getTime();
      if (Number.isNaN(msLeft) || msLeft <= 0) {
        return { plan: "locked", trialDaysLeft: 0, showBadge: true, widgetEnabled: false };
      }
      return {
        plan: "trial",
        trialDaysLeft: Math.ceil(msLeft / DAY_MS),
        showBadge: true,
        widgetEnabled: true,
      };
    }
  }
}

/**
 * Maps a Lemon Squeezy subscription status to our profiles.subscription_status.
 *
 * LS semantics worth preserving:
 * - "cancelled" means cancelled-at-period-end: the customer already paid for
 *   the current period, so they keep Pro until LS sends subscription_expired.
 * - "on_trial" only occurs if the LS product has its own trial; we run our own
 *   14-day trial before checkout, so a paying LS subscription counts as active.
 * - "past_due"/"unpaid" are dunning states; "paused" suspends payments.
 */
export function lsStatusToSubscriptionStatus(lsStatus: string): SubscriptionStatus {
  switch (lsStatus) {
    case "on_trial":
    case "active":
    case "cancelled":
      return "active";
    case "expired":
      return "cancelled";
    case "past_due":
    case "unpaid":
    case "paused":
    default:
      // Unknown/new LS statuses fail soft: a paying customer must never be
      // hard-locked because LS shipped a status we don't know yet.
      return "past_due";
  }
}
