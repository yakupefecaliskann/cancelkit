-- Remove the Lemon Squeezy billing columns from profiles.
--
-- CancelKit no longer has a paid tier: the checkout, the LS webhook and the
-- trial lock were deleted, so nothing reads or writes these columns. They
-- carry no data worth keeping — the store never left test mode and no account
-- was ever billed through it.
--
-- DEPLOY ORDER: ship the application change FIRST. The webhook route that
-- writes these columns must already be gone when this runs, otherwise a
-- delivery arriving mid-deploy fails on a missing column.

alter table public.profiles
  drop column if exists ls_customer_id,
  drop column if exists ls_subscription_id,
  drop column if exists ls_last_event_at;

-- Deliberately left in place, to be decided separately:
--   profiles.subscription_status / trial_ends_at / past_due_since — unused by
--     the app now. Dropping them is safe (handle_new_user only inserts id and
--     email; the values come from column defaults), but they are not
--     LS-specific and would be the schema to reuse if a paid tier returns.
--   public.webhook_events — its only producer was the LS webhook, but the
--     table is a generic idempotency log worth keeping if another provider
--     is ever added. Its `source` column still defaults to 'lemonsqueezy'.
