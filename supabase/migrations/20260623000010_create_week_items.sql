-- Migration 010: Create week_items table for tracking upcoming weekly tasks.
--
-- week_items records what is coming up over the next few days, scoped to a
-- project. Each row carries a title and a loose time label (e.g. "Monday",
-- "Thursday", "This Weekend"). This replaces the static mock in
-- lib/dashboard-data.ts and completes the dashboard data foundation.
--
-- FK: project_id references projects.id ON DELETE RESTRICT, consistent with
-- reminders, notes, and follow_ups. Delete week_items before deleting a project.
--
-- RLS: per-user ownership enforced on all four operations.
-- INSERT and UPDATE policies additionally verify project_id belongs to the
-- current user (consistent with migration 008 relationship-ownership checks).
--
-- Grant: explicit grant to authenticated required for Supabase projects
-- created after April 2026, which no longer auto-expose tables via the Data API.

-- ─── Table ─────────────────────────────────────────────────────────────────────

create table public.week_items (
  id          text        primary key default gen_random_uuid()::text,
  title       text        not null,
  due_label   text        not null default 'Soon',
  project_id  text        not null references public.projects(id) on delete restrict,
  user_id     uuid        not null default auth.uid() references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now()
);

-- ─── RLS ───────────────────────────────────────────────────────────────────────

alter table public.week_items enable row level security;

grant select, insert, update, delete on public.week_items to authenticated;

create policy "week_items_select" on public.week_items
  for select to authenticated
  using ( user_id = (select auth.uid()) );

-- INSERT: row must be owned by current user and project must belong to them.
create policy "week_items_insert" on public.week_items
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
create policy "week_items_update" on public.week_items
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

create policy "week_items_delete" on public.week_items
  for delete to authenticated
  using ( user_id = (select auth.uid()) );
