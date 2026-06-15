-- Migration: create clients table and extend projects with client_id.
-- Clients represent organizations or individuals who hire Ray.
-- Projects optionally belong to a client.
--
-- ⚠ SECURITY LIMITATION: permissive RLS until milestone 0.5 auth.
--   Any client with the anon key can read and write all rows.
--   Do not store sensitive information until auth policies are added.

-- 1. Create clients table.
create table if not exists public.clients (
  id           text        primary key default gen_random_uuid()::text,
  name         text        not null,
  contact_name text,
  created_at   timestamptz not null default now()
);

alter table public.clients enable row level security;

create policy "allow_all_until_auth"
  on public.clients
  for all
  using (true)
  with check (true);

-- 2. Give the projects.id column a default so rows inserted without an
--    explicit id (user-created projects) get a UUID automatically.
alter table public.projects
  alter column id set default gen_random_uuid()::text;

-- 3. Add nullable client_id FK to projects.
--    ON DELETE SET NULL: deleting a client un-links its projects rather
--    than blocking the delete. Projects keep their data.
alter table public.projects
  add column if not exists client_id text
    references public.clients(id)
    on delete set null;
