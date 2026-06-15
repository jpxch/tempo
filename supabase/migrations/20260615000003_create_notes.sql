-- Migration: create notes table
-- Stores captured notes associated with a project.
-- Maps to the Note type used in the dashboard.

create table if not exists public.notes (
  id            text        primary key default gen_random_uuid()::text,
  title         text        not null,
  preview       text        not null,
  project_id    text        not null references public.projects(id),
  updated_label text        not null default 'Just now',
  created_at    timestamptz not null default now()
);

-- ⚠ SECURITY LIMITATION: permissive until milestone 0.5 auth.
alter table public.notes enable row level security;

create policy "allow_all_until_auth"
  on public.notes
  for all
  using (true)
  with check (true);
