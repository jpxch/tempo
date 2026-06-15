<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Tempo Agent Instructions

## Project

Tempo is a personal operations assistant for creative freelancers.

Read these before substantial work:

- `docs/product-brief.md`
- `docs/roadmap.md`
- `docs/architecture.md`
- `docs/database.md`

Follow the roadmap order. Do not introduce features assigned to later milestones without explicit approval.

## Current Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase
- pnpm

Use `pnpm`, not npm or yarn.

## Product Principles

- The dashboard is the primary product surface.
- Optimize for morning clarity and fast capture.
- Keep project context and project colors visible.
- Comfort View is important accessibility behavior for Ray.
- Prefer incremental changes over broad rewrites.
- Preserve the established Tempo-themed UI language.

## Current Scope

- Projects, reminders, and notes use Supabase.
- Week items and follow-ups are still mocked.
- Authentication is deferred until roadmap version 0.5.
- Do not add AI or calendar sync yet.
- Do not store sensitive information while RLS remains permissive.

## Supabase Safety

- Never read, print, expose, or commit `.env.local`.
- Never use a service-role key in client code.
- Browser code may use only the publishable key.
- Keep `.env.example` limited to variable names.
- Add database changes as ordered SQL files under `supabase/migrations/`.
- Document migration order and any required manual setup.
- Do not add auth middleware or protected-route redirects before version 0.5.

## Engineering Rules

- Inspect existing files before proposing new ones.
- Do not assume files, routes, types, or APIs exist.
- Preserve the current Server/Client Component boundaries.
- Keep shared state and Supabase data consistent across dashboard and project routes.
- Avoid new dependencies unless clearly necessary.
- Do not refactor unrelated code.
- Do not revert user changes.

## Required Verification

Before declaring work complete, run:

```bash
pnpm exec tsc --noEmit
pnpm lint
git diff --check
```

Also run pnpm build when possible. If it fails because Google Fonts or another external service is unavailable, report that exact limitation.
For route or data changes, smoke-test the relevant routes.
After implementation, summarize:
-Files created
-Files changed
-Behavior completed
-Verification results
-Migrations the user must run
-Security limitations
-Remaining risks
