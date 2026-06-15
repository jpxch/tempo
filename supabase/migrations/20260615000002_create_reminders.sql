-- Migration: create reminders table
-- Stores captured reminders associated with a project.
-- Maps to the TodayItem type used in the dashboard.

create table if not exists public.reminders (
  id         text        primary key default gen_random_uuid()::text,
  title      text        not null,
  detail     text        not null default 'Captured in Tempo',
  time_label text        not null default 'Just now',
  type       text        not null default 'Reminder',
  project_id text        not null references public.projects(id),
  created_at timestamptz not null default now()
);

-- ⚠ SECURITY LIMITATION: permissive until milestone 0.5 auth.
alter table public.reminders enable row level security;

create policy "allow_all_until_auth"
  on public.reminders
  for all
  using (true)
  with check (true);
