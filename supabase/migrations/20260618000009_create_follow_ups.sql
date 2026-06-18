-- Migration 009: Create follow_ups table for milestone 1.0.
--
-- Stores follow-up items: people Ray is waiting on or needs to contact.
-- Mirrors the RLS/ownership and relationship-check pattern from migrations
-- 007 and 008 (reminders, notes).
--
-- Status values: 'open' (pending) | 'done' (completed).
-- Only open follow-ups are surfaced on the dashboard. The /follow-ups
-- management page shows all rows regardless of status.
--
-- The project_id FK uses ON DELETE RESTRICT (Postgres default) so a project
-- cannot be deleted while it has follow-up rows. Delete the follow-up rows
-- first, or use the app which surfaces a readable pre-check error.

create table public.follow_ups (
  id         text        primary key default gen_random_uuid()::text,
  person     text        not null,
  reason     text        not null default '',
  due_label  text        not null default '',
  project_id text        not null references public.projects(id) on delete restrict,
  status     text        not null default 'open',
  user_id    uuid        not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.follow_ups enable row level security;

-- Explicit grant required for Supabase projects created after April 2026.
grant select, insert, update, delete on public.follow_ups to authenticated;

-- Users may only read their own rows.
create policy "follow_ups_select" on public.follow_ups
  for select to authenticated
  using ( user_id = (select auth.uid()) );

-- Insert: user_id must match and the referenced project must belong to the same user.
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

-- Update: row must be owned by user; updated project_id must also be owned by user.
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

-- Delete: row must be owned by user.
create policy "follow_ups_delete" on public.follow_ups
  for delete to authenticated
  using ( user_id = (select auth.uid()) );
