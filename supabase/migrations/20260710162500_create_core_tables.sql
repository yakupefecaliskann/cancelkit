-- CancelKit core schema (docs/ARCHITECTURE.md #5)

create extension if not exists pgcrypto;

-- profiles: extends auth.users with our billing state (Lemon Squeezy)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  ls_customer_id text,
  ls_subscription_id text,
  subscription_status text not null default 'trialing'
    check (subscription_status in ('trialing', 'active', 'past_due', 'cancelled')),
  trial_ends_at timestamptz not null default (now() + interval '14 days'),
  created_at timestamptz not null default now()
);

-- projects: one row per customer SaaS integration
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  publishable_key text unique not null,
  allowed_origins text[] not null default '{}',
  encrypted_stripe_key text,
  accent_color text not null default '#6366F1',
  created_at timestamptz not null default now()
);

create index if not exists projects_user_id_idx on public.projects(user_id);

-- offers: save offers shown in the widget (discount or pause)
create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  type text not null check (type in ('discount', 'pause')),
  percent_off int,
  duration_months int,
  pause_months int,
  headline text not null,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists offers_project_id_idx on public.offers(project_id);

-- survey_reasons: exit-survey options, seeded with defaults per project
create table if not exists public.survey_reasons (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  label text not null,
  sort_order int not null default 0
);

create index if not exists survey_reasons_project_id_idx on public.survey_reasons(project_id);

-- cancel_sessions: one row per end-customer cancellation attempt
create table if not exists public.cancel_sessions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  session_token text unique not null,
  customer_id text,
  customer_email text,
  reason_id uuid references public.survey_reasons(id) on delete set null,
  reason_text text,
  offer_id uuid references public.offers(id) on delete set null,
  outcome text not null default 'open'
    check (outcome in ('open', 'saved', 'churned', 'abandoned')),
  saved_mrr_cents bigint,
  currency text not null default 'usd',
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists cancel_sessions_project_id_idx on public.cancel_sessions(project_id);
create index if not exists cancel_sessions_project_created_idx
  on public.cancel_sessions(project_id, created_at desc);

-- webhook_events: Lemon Squeezy event log for idempotency (service-role only)
create table if not exists public.webhook_events (
  id text primary key,
  source text not null default 'lemonsqueezy',
  type text not null,
  payload jsonb not null,
  processed_at timestamptz not null default now()
);
