# Tempo Architecture

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui / Radix UI
- Supabase (Database + Auth)
- Vercel (target deployment)

## App Structure

```
app/
  layout.tsx          — root layout: html, body, fonts
  page.tsx            — redirects / → /dashboard
  (app)/              — protected route group
    layout.tsx        — AppShell + TempoProvider + Supabase data fetch
    dashboard/
    projects/
    clients/
    notes/
    reminders/
  (auth)/             — public route group
    layout.tsx        — centered auth layout (no nav)
    login/            — email/password login form
components/           — shared UI components
lib/
  supabase/           — server client, browser client, queries, mutations
  dashboard-data.ts   — mock data for still-mocked entities
docs/                 — product and technical planning
supabase/migrations/  — ordered SQL migration files
```

## Auth and Privacy

Authentication uses Supabase Auth (email + password). The privacy boundary has
two layers:

1. **Proxy (`proxy.ts`)** — Next.js 16 Proxy runs on every request and redirects
   unauthenticated users to `/auth/login`. Uses `supabase.auth.getUser()` (which
   validates the JWT against the Supabase Auth server) rather than `getSession()`
   (which reads cookies without server verification). Also refreshes session
   tokens and writes updated cookies back to the response.

2. **Row-Level Security (RLS)** — Every table has per-user ownership policies.
   `user_id = (select auth.uid())` restricts all reads and writes to the
   authenticated owner. This is the primary data security boundary. The proxy
   is a convenience layer that prevents unauthenticated users from reaching
   server-rendered pages; RLS ensures data is never leaked at the database level
   even if the proxy is bypassed.

## Supabase Client Architecture

| File | Side | Role |
|---|---|---|
| `lib/supabase/server.ts` | Server only | Async `createClient()` — reads/writes session cookies. Used in layouts, Server Components, and Server Actions. |
| `lib/supabase/client.ts` | Browser only | Sync `createClient()` — browser singleton. Used in Client Components for mutations. |
| `lib/supabase/queries.ts` | Server only | Read functions imported from Server Components. |
| `lib/supabase/mutations.ts` | Browser only | Write functions imported from Client Components. |

## Server/Client Component Boundaries

- Layouts and pages are Server Components by default.
- Client Components (`'use client'`) are used for interactivity: CRUD forms,
  Comfort View toggle, logout button, Quick Capture, nav active state.
- TempoProvider (Client) holds dashboard state and exposes `addReminder` /
  `addNote` / `setComfortView` via context.
- `router.refresh()` re-runs the Server Component tree (including layouts),
  which re-fetches Supabase data and pushes fresh `initialData` into TempoProvider.

## Design Principle

The dashboard is the product. Other modules support the dashboard.

## Product-Driven Technical Rules

- Optimize for fast capture and morning review before adding integrations.
- Keep the initial data model small enough to change quickly.
- Treat project color-coding as product behavior, not decorative styling.
- Delay complex infrastructure until the core daily habit is proven.
