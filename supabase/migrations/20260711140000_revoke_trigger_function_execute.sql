-- Supabase security advisor (production scan, 2026-07-11): handle_new_user()
-- and seed_default_survey_reasons() are SECURITY DEFINER trigger functions,
-- meant to fire only via their triggers, never invoked directly by a client.
-- Postgres grants EXECUTE to PUBLIC by default on function creation, and both
-- anon/authenticated inherit through PUBLIC, which made them callable via
-- PostgREST RPC (e.g. /rest/v1/rpc/seed_default_survey_reasons with an
-- arbitrary project_id). Revoking from PUBLIC closes this without affecting
-- the triggers themselves, which don't need an EXECUTE grant to fire.
revoke execute on function public.handle_new_user() from public;
revoke execute on function public.seed_default_survey_reasons() from public;
