// Mocked data for entities not yet persisted in Supabase.
// Remove an entity from this file once it has a real database table.
//
// Still mocked (intentional):
//   - weekItems   — no events/calendar table yet
//
// No longer here (now in Supabase):
//   - projects    → supabase/migrations/...seed_projects.sql
//   - reminders   → reminders table
//   - notes       → notes table
//   - followUps   → follow_ups table (migration 009)

import type { WeekItem } from '@/types/dashboard';

export const mockWeekItems: WeekItem[] = [
  { title: 'Showcase rehearsal', dueLabel: 'Thursday', projectId: 'live-show-prep' },
  { title: 'Payment follow-up', dueLabel: 'Friday', projectId: 'artist-choreo-package' },
  { title: 'New artist concept review', dueLabel: 'Weekend', projectId: 'workshop-series' },
];
