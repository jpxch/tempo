-- Migration 007: Add user ownership and tighten RLS for milestone 0.5 auth.
--
-- What this does:
--   1. Adds a nullable user_id column to all four tables.
--      Nullable allows existing pre-auth rows to stay in place; they simply
--      become invisible to authenticated queries (no policy matches NULL).
--   2. Adds a default of auth.uid() so new inserts automatically stamp the
--      current user without the client needing to supply the column.
--   3. Drops the permissive pre-auth policies.
--   4. Creates per-operation, per-user policies that enforce ownership.
--   5. Grants explicit table access to the authenticated role.
--      Required for Supabase projects created after April 2026, which no
--      longer auto-expose tables via the Data API.
--
-- Backfill note:
--   Rows written before auth (e.g. seed data) have user_id = NULL and will
--   not be visible after login. To claim them:
--
--   1. Find your user UUID: Authentication → Users in the Supabase dashboard.
--   2. Run in the SQL Editor (replace <USER_UUID> with your actual UUID):
--
--     update public.clients   set user_id = '<USER_UUID>'::uuid where user_id is null;
--     update public.projects  set user_id = '<USER_UUID>'::uuid where user_id is null;
--     update public.reminders set user_id = '<USER_UUID>'::uuid where user_id is null;
--     update public.notes     set user_id = '<USER_UUID>'::uuid where user_id is null;
--
--   NOTE: Do NOT use auth.uid() in the SQL Editor — it returns NULL there
--   because the dashboard runs queries without a JWT context.
--
--   Or simply delete seed rows and recreate them through the app after login.
--
-- Security notes:
--   - Policies use (select auth.uid()) rather than auth.uid() directly
--     so the expression is evaluated once per statement, not per row.
--   - UPDATE policies carry both USING and WITH CHECK to prevent ownership
--     reassignment.
--   - auth.role() is deliberately NOT used (deprecated in Supabase);
--     the TO authenticated clause handles the role check.

-- ─── 1. Add user_id columns ──────────────────────────────────────────────────

alter table public.clients
  add column if not exists user_id uuid
    default auth.uid()
    references auth.users(id) on delete cascade;

alter table public.projects
  add column if not exists user_id uuid
    default auth.uid()
    references auth.users(id) on delete cascade;

alter table public.reminders
  add column if not exists user_id uuid
    default auth.uid()
    references auth.users(id) on delete cascade;

alter table public.notes
  add column if not exists user_id uuid
    default auth.uid()
    references auth.users(id) on delete cascade;

-- ─── 2. Explicit table grants (required for post-April-2026 Supabase) ────────

grant select, insert, update, delete on public.clients   to authenticated;
grant select, insert, update, delete on public.projects  to authenticated;
grant select, insert, update, delete on public.reminders to authenticated;
grant select, insert, update, delete on public.notes     to authenticated;

-- ─── 3. Drop pre-auth permissive policies ────────────────────────────────────

drop policy if exists "allow_all_until_auth" on public.clients;
drop policy if exists "allow_all_until_auth" on public.projects;
drop policy if exists "allow_all_until_auth" on public.reminders;
drop policy if exists "allow_all_until_auth" on public.notes;

-- ─── 4. Per-user RLS policies ─────────────────────────────────────────────────

-- clients
create policy "clients_select" on public.clients
  for select to authenticated
  using ( user_id = (select auth.uid()) );

create policy "clients_insert" on public.clients
  for insert to authenticated
  with check ( user_id = (select auth.uid()) );

create policy "clients_update" on public.clients
  for update to authenticated
  using  ( user_id = (select auth.uid()) )
  with check ( user_id = (select auth.uid()) );

create policy "clients_delete" on public.clients
  for delete to authenticated
  using ( user_id = (select auth.uid()) );

-- projects
create policy "projects_select" on public.projects
  for select to authenticated
  using ( user_id = (select auth.uid()) );

create policy "projects_insert" on public.projects
  for insert to authenticated
  with check ( user_id = (select auth.uid()) );

create policy "projects_update" on public.projects
  for update to authenticated
  using  ( user_id = (select auth.uid()) )
  with check ( user_id = (select auth.uid()) );

create policy "projects_delete" on public.projects
  for delete to authenticated
  using ( user_id = (select auth.uid()) );

-- reminders
create policy "reminders_select" on public.reminders
  for select to authenticated
  using ( user_id = (select auth.uid()) );

create policy "reminders_insert" on public.reminders
  for insert to authenticated
  with check ( user_id = (select auth.uid()) );

create policy "reminders_update" on public.reminders
  for update to authenticated
  using  ( user_id = (select auth.uid()) )
  with check ( user_id = (select auth.uid()) );

create policy "reminders_delete" on public.reminders
  for delete to authenticated
  using ( user_id = (select auth.uid()) );

-- notes
create policy "notes_select" on public.notes
  for select to authenticated
  using ( user_id = (select auth.uid()) );

create policy "notes_insert" on public.notes
  for insert to authenticated
  with check ( user_id = (select auth.uid()) );

create policy "notes_update" on public.notes
  for update to authenticated
  using  ( user_id = (select auth.uid()) )
  with check ( user_id = (select auth.uid()) );

create policy "notes_delete" on public.notes
  for delete to authenticated
  using ( user_id = (select auth.uid()) );
