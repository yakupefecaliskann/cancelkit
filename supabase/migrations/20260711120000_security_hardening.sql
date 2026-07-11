-- Faz 6.5 — Code Audit & Security hardening (see TODO.md).
-- Forward-only migration; safe to run on a fresh production database.

-- ─────────────────────────────────────────────────────────────────────────────
-- GDPR-1 (Critical): a user must never be able to edit their own billing state.
-- Nothing in the app updates public.profiles as the *authenticated* user — the
-- signup trigger INSERTs, and only the Lemon Squeezy webhook (service_role)
-- UPDATEs billing columns. Without an UPDATE grant, an authenticated JWT hitting
-- the Supabase REST API directly (bypassing our app) can no longer flip
-- subscription_status/trial_ends_at to unlock Pro for free.
revoke update on public.profiles from authenticated;
drop policy if exists "profiles_update_own" on public.profiles;

-- profiles.email (Low): defense-in-depth for the webhook's email-based user
-- resolution fallback — two profiles must never share an email.
create unique index if not exists profiles_email_key on public.profiles (email);

-- PAY-2 (Medium) + PAY-6 (Low): event-ordering guard and past_due escalation.
alter table public.profiles
  add column if not exists ls_last_event_at timestamptz,
  add column if not exists past_due_since timestamptz;

-- ─────────────────────────────────────────────────────────────────────────────
-- GDPR-2 (Critical) + PAY-3 (Medium): at most ONE "saved" session per
-- (project, customer). This is the atomic DB backstop that makes it impossible
-- to stack multiple CancelKit retention discounts onto a single subscription,
-- even under a concurrent double-accept race — the second write hits this
-- unique index and fails instead of applying a second coupon.
create unique index if not exists cancel_sessions_one_save_per_customer
  on public.cancel_sessions (project_id, customer_id)
  where outcome = 'saved' and customer_id is not null;

-- Supports the (project, customer) rate-limit + already-saved lookups.
create index if not exists cancel_sessions_project_customer_created_idx
  on public.cancel_sessions (project_id, customer_id, created_at desc);
