-- Row Level Security: tenant isolation (docs/ARCHITECTURE.md #4.5)
-- Widget-facing API endpoints use the Supabase service role and bypass RLS entirely;
-- these policies protect the authenticated dashboard client only.

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.offers enable row level security;
alter table public.survey_reasons enable row level security;
alter table public.cancel_sessions enable row level security;
alter table public.webhook_events enable row level security;
-- webhook_events: no policies defined -> denied to anon/authenticated, service role only.

-- profiles: a user can read/update only their own row
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- projects: full CRUD scoped to the owning user
create policy "projects_select_own"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "projects_insert_own"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "projects_update_own"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "projects_delete_own"
  on public.projects for delete
  using (auth.uid() = user_id);

-- offers: scoped via the parent project's owner
create policy "offers_select_own"
  on public.offers for select
  using (exists (
    select 1 from public.projects p
    where p.id = offers.project_id and p.user_id = auth.uid()
  ));

create policy "offers_insert_own"
  on public.offers for insert
  with check (exists (
    select 1 from public.projects p
    where p.id = offers.project_id and p.user_id = auth.uid()
  ));

create policy "offers_update_own"
  on public.offers for update
  using (exists (
    select 1 from public.projects p
    where p.id = offers.project_id and p.user_id = auth.uid()
  ));

create policy "offers_delete_own"
  on public.offers for delete
  using (exists (
    select 1 from public.projects p
    where p.id = offers.project_id and p.user_id = auth.uid()
  ));

-- survey_reasons: scoped via the parent project's owner
create policy "survey_reasons_select_own"
  on public.survey_reasons for select
  using (exists (
    select 1 from public.projects p
    where p.id = survey_reasons.project_id and p.user_id = auth.uid()
  ));

create policy "survey_reasons_insert_own"
  on public.survey_reasons for insert
  with check (exists (
    select 1 from public.projects p
    where p.id = survey_reasons.project_id and p.user_id = auth.uid()
  ));

create policy "survey_reasons_update_own"
  on public.survey_reasons for update
  using (exists (
    select 1 from public.projects p
    where p.id = survey_reasons.project_id and p.user_id = auth.uid()
  ));

create policy "survey_reasons_delete_own"
  on public.survey_reasons for delete
  using (exists (
    select 1 from public.projects p
    where p.id = survey_reasons.project_id and p.user_id = auth.uid()
  ));

-- cancel_sessions: dashboard reads only; rows are written by the widget API (service role)
create policy "cancel_sessions_select_own"
  on public.cancel_sessions for select
  using (exists (
    select 1 from public.projects p
    where p.id = cancel_sessions.project_id and p.user_id = auth.uid()
  ));
