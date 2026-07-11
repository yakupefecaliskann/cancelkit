// Single source of truth for the public site URL. `NEXT_PUBLIC_APP_URL` is
// already part of the env contract (ARCHITECTURE §7); the localhost fallback
// keeps metadata/sitemap generation working in environments where it's unset.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
).replace(/\/$/, "");

export const SITE_NAME = "CancelKit";

export const SITE_TITLE = "CancelKit — Turn cancellations into saved revenue";

export const SITE_DESCRIPTION =
  "A drop-in cancel flow for indie SaaS founders: exit survey + instant Stripe-powered save offers.";

export const SUPPORT_EMAIL = "efecaliskan3458@gmail.com";
