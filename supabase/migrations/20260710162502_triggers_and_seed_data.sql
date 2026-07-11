-- Automation: profile bootstrap on signup + default survey reasons per project
-- (docs/ARCHITECTURE.md #5, docs/PRD.md C5 onboarding)

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.seed_default_survey_reasons()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.survey_reasons (project_id, label, sort_order) values
    (new.id, 'Too expensive', 1),
    (new.id, 'Not using it enough', 2),
    (new.id, 'Missing a feature I need', 3),
    (new.id, 'Switching to a competitor', 4),
    (new.id, 'Technical issues', 5),
    (new.id, 'Other', 6);
  return new;
end;
$$;

drop trigger if exists on_project_created_seed_reasons on public.projects;
create trigger on_project_created_seed_reasons
  after insert on public.projects
  for each row execute function public.seed_default_survey_reasons();
