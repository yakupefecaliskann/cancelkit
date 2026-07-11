import "server-only";

// Lemon Squeezy checkout creation (our own billing — Merchant of Record).
// A checkout is created via the LS API rather than a static buy link so the
// user's email is prefilled server-side (never in a URL query string) and our
// user id travels as custom data for the webhook to map the subscription back.

const LS_API_BASE = "https://api.lemonsqueezy.com/v1";

export class LemonSqueezyConfigError extends Error {
  constructor() {
    super("Lemon Squeezy env vars missing (LEMONSQUEEZY_API_KEY / STORE_ID / VARIANT_ID).");
    this.name = "LemonSqueezyConfigError";
  }
}

export async function createCheckoutUrl(params: {
  email: string;
  userId: string;
}): Promise<string> {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;
  if (!apiKey || !storeId || !variantId) throw new LemonSqueezyConfigError();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const response = await fetch(`${LS_API_BASE}/checkouts`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            email: params.email,
            custom: { user_id: params.userId },
          },
          product_options: {
            redirect_url: `${appUrl}/app/overview?upgraded=1`,
          },
        },
        relationships: {
          store: { data: { type: "stores", id: storeId } },
          variant: { data: { type: "variants", id: variantId } },
        },
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Lemon Squeezy checkout failed (${response.status}): ${detail.slice(0, 300)}`);
  }

  const json = (await response.json()) as { data?: { attributes?: { url?: string } } };
  const url = json.data?.attributes?.url;
  if (!url) throw new Error("Lemon Squeezy checkout response did not include a URL.");
  return url;
}
