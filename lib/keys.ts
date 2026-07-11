import { customAlphabet } from "nanoid";

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const nanoid = customAlphabet(alphabet, 32);

export function generatePublishableKey(): string {
  return `pk_live_${nanoid()}`;
}

/** Detects a Stripe *full* secret key (sk_...) as opposed to a restricted key (rk_...). */
export function isFullStripeSecretKey(key: string): boolean {
  return key.startsWith("sk_live_") || key.startsWith("sk_test_");
}

export function isRestrictedStripeKey(key: string): boolean {
  return key.startsWith("rk_live_") || key.startsWith("rk_test_");
}
