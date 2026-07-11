import "server-only";
import Stripe from "stripe";
import { decrypt } from "@/lib/crypto";
import { computeMonthlyAmountCents } from "@/lib/stripe-mrr";
import type { Offer, Project } from "@/lib/types";

/**
 * Every Stripe call CancelKit makes on behalf of a project runs against the
 * *project owner's* Stripe account, never ours (ARCHITECTURE §4.2). The
 * client is therefore built per-request from the project's encrypted key.
 */
export function createStripeClient(secretKey: string): Stripe {
  // Test-only escape hatch: point the SDK at stripe-mock (or any local mock)
  // without touching production behavior. Unset in real environments.
  const base = process.env.STRIPE_API_BASE;
  if (base) {
    const url = new URL(base);
    return new Stripe(secretKey, {
      host: url.hostname,
      port: url.port || undefined,
      protocol: url.protocol === "http:" ? "http" : "https",
    });
  }
  return new Stripe(secretKey);
}

export type ProjectStripeClientResult =
  | { ok: true; stripe: Stripe }
  | { ok: false; reason: "no_stripe_key" | "invalid_stripe_key" };

/** Decrypts the project's AES-256-GCM stored key and builds its Stripe client. */
export function createProjectStripeClient(project: Project): ProjectStripeClientResult {
  if (!project.encrypted_stripe_key) return { ok: false, reason: "no_stripe_key" };

  let secretKey: string;
  try {
    secretKey = decrypt(project.encrypted_stripe_key);
  } catch {
    // Tampered payload or rotated ENCRYPTION_KEY — never let this bubble up
    // as a 500; the widget shows its graceful error state instead.
    return { ok: false, reason: "invalid_stripe_key" };
  }
  return { ok: true, stripe: createStripeClient(secretKey) };
}

export type ApplyOfferResult =
  | { ok: true; savedMrrCents: number; currency: string }
  | { ok: false; reason: "no_active_subscription" | "unsupported_offer" | "stripe_error" };

/**
 * Applies a retention offer to the customer's active subscription:
 * discount → one-off coupon redeemed onto the subscription's discounts;
 * pause → pause_collection with a resume date. Returns the subscription's
 * monthly value so the caller can record saved_mrr_cents.
 *
 * All mutations carry session-scoped idempotency keys, so a double-clicked
 * "Accept offer" can never create two coupons or apply twice.
 */
export async function applyOfferToCustomer(
  stripe: Stripe,
  offer: Offer,
  customerId: string,
  idempotencyPrefix: string,
): Promise<ApplyOfferResult> {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    const subscription = subscriptions.data[0];
    if (!subscription) return { ok: false, reason: "no_active_subscription" };

    if (offer.type === "discount") {
      if (!offer.percent_off) return { ok: false, reason: "unsupported_offer" };

      const months = offer.duration_months ?? 1;
      const coupon = await stripe.coupons.create(
        {
          percent_off: offer.percent_off,
          ...(months > 1
            ? { duration: "repeating" as const, duration_in_months: months }
            : { duration: "once" as const }),
          name: `CancelKit retention: ${offer.percent_off}% off`,
          max_redemptions: 1,
          metadata: { cancelkit_offer: offer.id },
        },
        { idempotencyKey: `ck-${idempotencyPrefix}-coupon` },
      );

      // `discounts` overwrites the subscription's discount list, so carry any
      // existing discounts along instead of silently dropping them.
      const existing = subscription.discounts.map((d) => ({
        discount: typeof d === "string" ? d : d.id,
      }));
      await stripe.subscriptions.update(
        subscription.id,
        { discounts: [...existing, { coupon: coupon.id }] },
        { idempotencyKey: `ck-${idempotencyPrefix}-apply` },
      );
    } else if (offer.type === "pause") {
      const months = offer.pause_months ?? 1;
      const resumesAt = new Date();
      resumesAt.setMonth(resumesAt.getMonth() + months);
      await stripe.subscriptions.update(
        subscription.id,
        {
          pause_collection: {
            behavior: "void",
            resumes_at: Math.floor(resumesAt.getTime() / 1000),
          },
        },
        { idempotencyKey: `ck-${idempotencyPrefix}-pause` },
      );
    } else {
      return { ok: false, reason: "unsupported_offer" };
    }

    const { cents, currency } = computeMonthlyAmountCents(subscription);
    return { ok: true, savedMrrCents: cents, currency };
  } catch (err) {
    // Key material is never logged — Stripe error messages don't contain it.
    console.error(
      "[cancelkit] Stripe offer apply failed:",
      err instanceof Stripe.errors.StripeError ? `${err.type}: ${err.message}` : err,
    );
    return { ok: false, reason: "stripe_error" };
  }
}
