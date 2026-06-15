# Tempo Database

Status: Active — milestone 0.3.2 complete.

## Environment variables

Copy `.env.example` to `.env.local` and fill in both values before running the app.

| Variable | Where used | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Server + browser | Safe to expose — no secrets |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Server + browser | Safe to expose — RLS enforces access |

Use the JWT anon key (starts with `eyJ`) from Project Settings → API in your
Supabase dashboard. The `sb_publishable_*` format shown on the "Connect" page
requires `@supabase/supabase-js` v3, which is not yet released.

A service-role key is never required and must never appear in this codebase.

## Setup (one time)

1. Create a Supabase project at supabase.com.
2. Copy the Project URL and JWT anon key into `.env.local`.
3. Open the SQL Editor in the Supabase dashboard.
4. Run each migration file in order:

```
supabase/migrations/20260615000001_create_projects.sql
supabase/migrations/20260615000002_create_reminders.sql
supabase/migrations/20260615000003_create_notes.sql
supabase/migrations/20260615000004_seed_projects.sql
supabase/migrations/20260615000005_create_clients.sql
supabase/migrations/20260615000006_seed_clients.sql
```

Migration 5 alters the existing `projects` table (adds `client_id` column and
sets a UUID default on `id`). It is safe to run on a database that already has
projects from migrations 1–4.

## Supabase client architecture

| File | Side | Purpose |
|---|---|---|
| `lib/supabase/server.ts` | Server only | `createClient()` — async, needs `await`. For Server Components and layouts. |
| `lib/supabase/client.ts` | Browser only | `createClient()` — sync, browser singleton via `@supabase/ssr`. For Client Components. |
| `lib/supabase/queries.ts` | Server only | Read functions — import from Server Components. |
| `lib/supabase/mutations.ts` | Browser only | Write functions — import from Client Components. |

Do not import `lib/supabase/server.ts` from Client Components or vice versa.

## Persisted entities

### clients

| Column | Type | Notes |
|---|---|---|
| id | text PK | UUID default from gen_random_uuid() |
| name | text | |
| contact_name | text | Nullable — primary contact person |
| created_at | timestamptz | Default now() |

### projects

| Column | Type | Notes |
|---|---|---|
| id | text PK | UUID default from gen_random_uuid() (seeded rows use slug IDs) |
| name | text | |
| status | text | Active / Upcoming / Waiting / Completed |
| next | text | Short next-action label, default '' |
| color | text | Hex color string |
| client_id | text FK | Nullable. References clients.id ON DELETE SET NULL |
| created_at | timestamptz | Default now() |

### reminders

| Column | Type | Notes |
|---|---|---|
| id | text PK | UUID default |
| title | text | The reminder text |
| detail | text | Default: 'Captured in Tempo' |
| time_label | text | Default: 'Just now' |
| type | text | Default: 'Reminder' |
| project_id | text FK | References projects.id (ON DELETE RESTRICT) |
| created_at | timestamptz | |

### notes

| Column | Type | Notes |
|---|---|---|
| id | text PK | UUID default |
| title | text | The note text |
| preview | text | Same as title for now |
| project_id | text FK | References projects.id (ON DELETE RESTRICT) |
| updated_label | text | Default: 'Just now' |
| created_at | timestamptz | |

## CRUD behavior

| Entity | Create | Read | Update | Delete |
|---|---|---|---|---|
| clients | ✓ | ✓ | ✓ | ✓ — linked projects become unassigned (ON DELETE SET NULL) |
| projects | ✓ | ✓ | ✓ | Blocked if reminders or notes exist — delete those first |
| reminders | ✓ | ✓ | ✓ title | ✓ |
| notes | ✓ | ✓ | ✓ title | ✓ |

## Intentionally still mocked

These entities have no database table yet. They live in `lib/dashboard-data.ts`.

- **weekItems** — no events or calendar table yet
- **followUps** — no follow-up table yet

## Security limitations (pre-auth)

Row-level security is enabled on all tables, but the current policies allow any
client with the anon key to read and write all rows. This is intentional for the
single-user local workflow at milestone 0.3.

**Do not store private or sensitive data until milestone 0.5 (auth) ships.** At
that point, RLS policies will be updated to scope rows to the authenticated user.

## Not needed yet

- Authentication and user-owned rows
- Collaboration or multi-user tables
- Recurrence engine
- Calendar sync schema
- File attachment modeling
- Payments table
