-- Postgres requires an explicit GRANT before a role can touch a table at all,
-- even service_role. RLS policies (see 20260710162501_enable_rls_policies.sql)
-- then restrict *which rows* each role can reach on top of this.
grant usage on schema public to authenticated, service_role;

grant select, insert, update, delete on
  public.profiles,
  public.projects,
  public.offers,
  public.survey_reasons,
  public.cancel_sessions,
  public.webhook_events
to authenticated, service_role;
