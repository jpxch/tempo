# Tempo Database

Status: Active — milestone 0.5 (auth) complete. follow_ups table added (migration 009).

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

## Auth setup (one time)

1. In the Supabase dashboard go to **Authentication → Providers** and enable **Email**.
2. Optionally disable "Confirm email" for single-user local use (Settings → Authentication).
3. Create your account: go to **Authentication → Users → Add user** and create a user with your email and a strong password.
4. Copy the Project URL and JWT anon key into `.env.local`.

## Migration setup (one time)

Open the SQL Editor in the Supabase dashboard and run each migration file in order:

```
supabase/migrations/20260615000001_create_projects.sql
supabase/migrations/20260615000002_create_reminders.sql
supabase/migrations/20260615000003_create_notes.sql
supabase/migrations/20260615000004_seed_projects.sql
supabase/migrations/20260615000005_create_clients.sql
supabase/migrations/20260615000006_seed_clients.sql
supabase/migrations/20260616000007_add_auth.sql
supabase/migrations/20260616000008_rls_relationship_checks.sql
supabase/migrations/20260623000009_create_follow_ups.sql
```

Migration 5 alters the `projects` table (adds `client_id` column).
Migration 7 adds `user_id` columns and replaces permissive policies with
per-user ownership policies.
Migration 8 tightens insert/update policies so related `client_id` and
`project_id` values must also belong to the current user.
Migration 9 creates the `follow_ups` table with full RLS and relationship
ownership checks consistent with migration 8.

## Backfilling pre-auth rows

Rows created before migration 7 (e.g. seeded data) have `user_id = NULL` and
are invisible to authenticated queries. To claim them:

1. Find your user UUID: **Authentication → Users** in the Supabase dashboard.
2. Open the SQL Editor and run (replace `<USER_UUID>` with your actual UUID):

```sql
update public.clients   set user_id = '<USER_UUID>'::uuid where user_id is null;
update public.projects  set user_id = '<USER_UUID>'::uuid where user_id is null;
update public.reminders set user_id = '<USER_UUID>'::uuid where user_id is null;
update public.notes     set user_id = '<USER_UUID>'::uuid where user_id is null;
```

> **Do not use `auth.uid()` in the SQL Editor.** The dashboard runs queries
> without a JWT context, so `auth.uid()` returns NULL and the update silently
> affects zero rows.

Alternatively, delete the seed rows and recreate your data through the app.

## Supabase client architecture

| File | Side | Purpose |
|---|---|---|
| `lib/supabase/server.ts` | Server only | `createClient()` — async, needs `await`. For Server Components and layouts. |
| `lib/supabase/client.ts` | Browser only | `createClient()` — sync, browser singleton via `@supabase/ssr`. For Client Components. |
| `lib/supabase/queries.ts` | Server only | Read functions — import from Server Components. |
| `lib/supabase/mutations.ts` | Browser only | Write functions — import from Client Components. |

Do not import `lib/supabase/server.ts` from Client Components or vice versa.

## Persisted entities

All tables have a `user_id uuid` column that references `auth.users(id)`.
RLS enforces that each user can only read and write their own rows.
New rows have `user_id` set automatically via `default auth.uid()`.

### clients

| Column | Type | Notes |
|---|---|---|
| id | text PK | UUID default from gen_random_uuid() |
| name | text | |
| contact_name | text | Nullable — primary contact person |
| user_id | uuid FK | References auth.users(id) ON DELETE CASCADE |
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
| user_id | uuid FK | References auth.users(id) ON DELETE CASCADE |
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
| user_id | uuid FK | References auth.users(id) ON DELETE CASCADE |
| created_at | timestamptz | |

### notes

| Column | Type | Notes |
|---|---|---|
| id | text PK | UUID default |
| title | text | The note text |
| preview | text | Same as title for now |
| project_id | text FK | References projects.id (ON DELETE RESTRICT) |
| user_id | uuid FK | References auth.users(id) ON DELETE CASCADE |
| updated_label | text | Default: 'Just now' |
| created_at | timestamptz | |

### follow_ups

| Column | Type | Notes |
|---|---|---|
| id | text PK | UUID default from gen_random_uuid()::text |
| person | text | Name of the person to follow up with |
| reason | text | What you are waiting on — default '' |
| due_label | text | Loose time label (Today / Tomorrow / This Week / Soon) — default 'Soon' |
| project_id | text FK | References projects.id (ON DELETE RESTRICT) |
| user_id | uuid FK NOT NULL | References auth.users(id) ON DELETE CASCADE |
| created_at | timestamptz | Default now() |

## CRUD behavior

| Entity | Create | Read | Update | Delete |
|---|---|---|---|---|
| clients | ✓ | ✓ (own rows only) | ✓ | ✓ — linked projects become unassigned (ON DELETE SET NULL) |
| projects | ✓ | ✓ (own rows only) | ✓ | Blocked if reminders, notes, or follow-ups exist — delete those first |
| reminders | ✓ | ✓ (own rows only) | ✓ title | ✓ |
| notes | ✓ | ✓ (own rows only) | ✓ title | ✓ |
| follow_ups | ✓ | ✓ (own rows only) | ✓ person / reason / due_label | ✓ |

## RLS policy model

Each table has four named policies (select / insert / update / delete), all
scoped to the `authenticated` role. All policies use:

```sql
user_id = (select auth.uid())
```

The `select auth.uid()` subquery is evaluated once per statement (not per row)
for performance. UPDATE policies carry both `USING` and `WITH CHECK` to prevent
ownership reassignment. Project policies also verify linked clients are owned
by the same user, and reminder/note/follow-up policies verify linked projects
are owned by the same user. `auth.role()` is not used (deprecated in Supabase).

## Intentionally still mocked

These entities have no database table yet. They live in `lib/dashboard-data.ts`.

- **weekItems** — no events or calendar table yet

## Security

Row-level security is enabled on all tables. Policies restrict every operation
to the row owner identified by `auth.uid()`. Anonymous and unauthenticated
requests see no rows and cannot insert.

The app itself enforces route-level protection via `proxy.ts` (Next.js 16
Proxy), which redirects unauthenticated requests to `/login`. RLS is the
primary data security boundary; the proxy is a convenience layer on top.

## Not needed yet

- Collaboration or multi-user tables
- Recurrence engine
- Calendar sync schema
- File attachment modeling
- Payments table
