-- Migration 011: Add soft completion to reminders.
--
-- "Mark done" should not delete reminders. A nullable completed_at timestamp
-- lets the app hide completed reminders from the dashboard while preserving
-- history and making accidental completion recoverable.

alter table public.reminders
  add column completed_at timestamptz;
