// Mocked data for entities not yet persisted in Supabase.
// Remove an entity from this file once it has a real database table.
//
// Still mocked (intentional for 0.3.x):
//   - weekItems   — no events/calendar table yet
//   - followUps   — no follow-up table yet
//
// No longer here (now in Supabase):
//   - projects    → supabase/migrations/...seed_projects.sql
//   - reminders   → reminders table
//   - notes       → notes table

import type { FollowUp, WeekItem } from '@/types/dashboard';

export const mockWeekItems: WeekItem[] = [
  { title: 'Showcase rehearsal', dueLabel: 'Thursday', projectId: 'live-show-prep' },
  { title: 'Payment follow-up', dueLabel: 'Friday', projectId: 'artist-choreo-package' },
  { title: 'New artist concept review', dueLabel: 'Weekend', projectId: 'workshop-series' },
];

export const mockFollowUps: FollowUp[] = [
  {
    person: 'Artist Manager',
    reason: 'Waiting on final music cut',
    dueLabel: 'Today',
    projectId: 'artist-choreo-package',
  },
  {
    person: 'Venue Coordinator',
    reason: 'Need stage dimensions',
    dueLabel: 'Tomorrow',
    projectId: 'live-show-prep',
  },
  {
    person: 'Workshop Client',
    reason: 'Approval pending',
    dueLabel: 'This Week',
    projectId: 'workshop-series',
  },
];
