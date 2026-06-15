-- Seed: insert realistic client rows and associate the seeded projects.
-- Human-readable IDs are used for seeded rows; user-created clients
-- receive UUID IDs from gen_random_uuid() (the column default).
-- ON CONFLICT DO NOTHING makes this safe to re-run.

insert into public.clients (id, name, contact_name) values
  ('client-nova-arts',   'Nova Arts Collective', 'Maya Pham'),
  ('client-river-dance', 'River Dance Company',  'James Okonkwo')
on conflict (id) do nothing;

-- Associate the seeded projects with clients.
-- WHERE client_id IS NULL prevents overwriting manual changes on re-run.
update public.projects
  set client_id = 'client-nova-arts'
  where id = 'artist-choreo-package' and client_id is null;

update public.projects
  set client_id = 'client-river-dance'
  where id = 'live-show-prep' and client_id is null;

-- workshop-series is intentionally left without a client to exercise the
-- "no client" display path in the UI.
