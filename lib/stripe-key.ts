import "server-only";
import Stripe from "stripe";
import { isFullStripeSecretKey, isRestrictedStripeKey } from "@/lib/keys";
import { createStripeClient } from "@/lib/stripe";

export type StripeKeyValidation =
  | { ok: true }
  | { ok: false; message: string };

/** Confirms the key looks like a Stripe secret key and actually works against Stripe. */
export async function validateStripeKey(secretKey: string): Promise<StripeKeyValidation> {
  if (!isRestrictedStripeKey(secretKey) && !isFullStripeSecretKey(secretKey)) {
    return { ok: false, message: "This doesn't look like a Stripe secret key (expected rk_... or sk_...)." };
  }

  const stripe = createStripeClient(secretKey);
  try {
    await stripe.customers.list({ limit: 1 });
    return { ok: true };
  } catch (err) {
    const message =
      err instanceof Stripe.errors.StripeError
        ? err.message
        : "Could not validate this key with Stripe.";
    return { ok: false, message };
  }
}
