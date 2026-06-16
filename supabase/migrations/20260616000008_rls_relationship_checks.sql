-- Migration 008: Tighten RLS with cross-table relationship ownership checks.
--
-- Problem: Migration 007 created insert/update policies that only verify
-- user_id = auth.uid() on the row being written. A user could insert a
-- reminder that references a project owned by a different user by supplying
-- that project's ID directly.
--
-- Fix: Replace the insert and update WITH CHECK clauses for:
--   - projects: client_id must be NULL or reference a client owned by this user
--   - reminders: project_id must reference a project owned by this user
--   - notes: project_id must reference a project owned by this user
--
-- The select and delete policies are unchanged (they already guard by user_id
-- on the row itself, and you cannot delete a row you cannot see).

-- ─── projects ────────────────────────────────────────────────────────────────

drop policy if exists "projects_insert" on public.projects;
drop policy if exists "projects_update" on public.projects;

create policy "projects_insert" on public.projects
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and (
      client_id is null
      or exists (
        select 1 from public.clients c
        where c.id = client_id
          and c.user_id = (select auth.uid())
      )
    )
  );

create policy "projects_update" on public.projects
  for update to authenticated
  using  ( user_id = (select auth.uid()) )
  with check (
    user_id = (select auth.uid())
    and (
      client_id is null
      or exists (
        select 1 from public.clients c
        where c.id = client_id
          and c.user_id = (select auth.uid())
      )
    )
  );

-- ─── reminders ───────────────────────────────────────────────────────────────

drop policy if exists "reminders_insert" on public.reminders;
drop policy if exists "reminders_update" on public.reminders;

create policy "reminders_insert" on public.reminders
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.projects p
      where p.id = project_id
        and p.user_id = (select auth.uid())
    )
  );

create policy "reminders_update" on public.reminders
  for update to authenticated
  using  ( user_id = (select auth.uid()) )
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.projects p
      where p.id = project_id
        and p.user_id = (select auth.uid())
    )
  );

-- ─── notes ───────────────────────────────────────────────────────────────────

drop policy if exists "notes_insert" on public.notes;
drop policy if exists "notes_update" on public.notes;

create policy "notes_insert" on public.notes
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.projects p
      where p.id = project_id
        and p.user_id = (select auth.uid())
    )
  );

create policy "notes_update" on public.notes
  for update to authenticated
  using  ( user_id = (select auth.uid()) )
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.projects p
      where p.id = project_id
        and p.user_id = (select auth.uid())
    )
  );
