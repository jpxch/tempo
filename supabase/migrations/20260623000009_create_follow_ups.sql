-- Migration 009: Create follow_ups table for tracking people and conversations.
--
-- follow_ups records who the user needs to follow up with, why, and a loose
-- time label (e.g. "Today", "Tomorrow", "This Week"). Each row is scoped to
-- a project so follow-ups appear in project context on the dashboard.
--
-- FK: project_id references projects.id ON DELETE RESTRICT, consistent with
-- reminders and notes. Delete follow-ups before deleting the project.
--
-- RLS: per-user ownership enforced on all four operations.
-- INSERT and UPDATE policies additionally verify project_id belongs to the
-- current user (consistent with migration 008 relationship-ownership checks).
--
-- Grant: explicit grant to authenticated required for Supabase projects
-- created after April 2026, which no longer auto-expose tables via the Data API.

-- ─── Table ─────────────────────────────────────────────────────────────────────

create table public.follow_ups (
  id          text        primary key default gen_random_uuid()::text,
  person      text        not null,
  reason      text        not null default '',
  due_label   text        not null default 'Soon',
  project_id  text        not null references public.projects(id) on delete restrict,
  user_id     uuid        not null default auth.uid() references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now()
);

-- ─── RLS ───────────────────────────────────────────────────────────────────────

alter table public.follow_ups enable row level security;

grant select, insert, update, delete on public.follow_ups to authenticated;

create policy "follow_ups_select" on public.follow_ups
  for select to authenticated
  using ( user_id = (select auth.uid()) );

-- INSERT: row must be owned by current user and project must belong to them.
create policy "follow_ups_insert" on public.follow_ups
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.projects p
      where p.id = project_id
        and p.user_id = (select auth.uid())
    )
  );

-- UPDATE: both USING and WITH CHECK prevent ownership reassignment.
create policy "follow_ups_update" on public.follow_ups
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

create policy "follow_ups_delete" on public.follow_ups
  for delete to authenticated
  using ( user_id = (select auth.uid()) );
