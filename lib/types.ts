export type Profile = {
  id: string;
  email: string;
  created_at: string;
  /** Left over from the removed paid tier. The columns still exist on the table
   *  (see the drop_lemonsqueezy_columns migration for what was removed); nothing
   *  reads them — CancelKit is free and the widget is always enabled. */
  subscription_status: string;
  trial_ends_at: string;
  past_due_since: string | null;
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
