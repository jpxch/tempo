-- Seed: insert the three validated projects.
-- IDs match lib/dashboard-data.ts so project detail routes resolve correctly.
-- Use ON CONFLICT DO NOTHING so re-running this migration is safe.

insert into public.projects (id, name, status, next, color) values
  (
    'artist-choreo-package',
    'Artist Choreo Package',
    'Active',
    'Needs music notes cleaned up',
    '#a78bfa'
  ),
  (
    'live-show-prep',
    'Live Show Prep',
    'Upcoming',
    'Confirm dancers and rehearsal space',
    '#38bdf8'
  ),
  (
    'workshop-series',
    'Workshop Series',
    'Waiting',
    'Waiting on client approval',
    '#f472b6'
  )
on conflict (id) do nothing;
