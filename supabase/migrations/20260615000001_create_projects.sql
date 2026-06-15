-- Migration: create projects table
-- Stores the core project entities that all other data references.

create table if not exists public.projects (
  id         text        primary key,
  name       text        not null,
  status     text        not null,
  next       text        not null default '',
  color      text        not null,
  created_at timestamptz not null default now()
);

-- Row-level security is enabled but policies are permissive until auth is added
-- in milestone 0.5. This is intentionally open for single-user local use.
-- ⚠ SECURITY LIMITATION: Any client with the anon key can read and write all rows.
-- Do not store sensitive production data until auth policies are in place.
alter table public.projects enable row level security;

create policy "allow_all_until_auth"
  on public.projects
  for all
  using (true)
  with check (true);
