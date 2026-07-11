import type { SubscriptionStatus } from "@/lib/billing";

export type Profile = {
  id: string;
  email: string;
  ls_customer_id: string | null;
  ls_subscription_id: string | null;
  subscription_status: SubscriptionStatus;
  trial_ends_at: string;
  /** Timestamp of the last Lemon Squeezy event applied — guards against out-of-order webhooks. */
  ls_last_event_at: string | null;
  /** When the account first entered past_due; escalates to locked after a grace window. */
  past_due_since: string | null;
  created_at: string;
};

export type Project = {
  id: string;
  user_id: string;
  name: string;
  publishable_key: string;
  allowed_origins: string[];
  encrypted_stripe_key: string | null;
  accent_color: string;
  created_at: string;
};

export type SurveyReason = {
  id: string;
  project_id: string;
  label: string;
  sort_order: number;
};

export type Offer = {
  id: string;
  project_id: string;
  type: "discount" | "pause";
  percent_off: number | null;
  duration_months: number | null;
  pause_months: number | null;
  headline: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export type CancelSessionOutcome = "open" | "saved" | "churned" | "abandoned";

export type CancelSession = {
  id: string;
  project_id: string;
  session_token: string;
  customer_id: string | null;
  customer_email: string | null;
  reason_id: string | null;
  reason_text: string | null;
  offer_id: string | null;
  outcome: CancelSessionOutcome;
  saved_mrr_cents: number | null;
  currency: string;
  created_at: string;
  resolved_at: string | null;
};
