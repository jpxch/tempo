# Tempo Roadmap

## Version 0.1 — Concept Prototype

Goal: Create a polished dashboard with fake data.

Features:

- Dashboard layout
- Today cards
- This week overview
- Active projects
- Follow-up reminders
- Quick capture input
- Recent notes

Success criteria:

- Ray understands the concept immediately
- Ray can say what feels useful
- Ray can point out what is missing

Estimated time: 3-7 days

## Version 0.1.5 — Feedback and Flow Refinement

Goal: Use Ray's feedback to tighten the information architecture before building persistence.

Focus:

- Clarify what belongs in Today, This Week, and Follow-ups
- Validate the project color-coding system
- Remove sections that feel decorative rather than useful
- Refine the morning dashboard hierarchy

Success criteria:

- Ray can describe the dashboard as helpful rather than just attractive
- The primary morning workflow feels obvious
- The next build phase is based on observed needs, not guesses

Estimated time: 2-5 days

## Version 0.2 — Local Single-User Workflow

Goal: Make the prototype genuinely usable without a backend.

Features:

- Add reminder locally
- Add note locally
- Associate reminders and notes with a project
- View lightweight project details
- Reflect local changes on the dashboard

Success criteria:

- A full capture-to-dashboard flow works in one session
- Ray can test the habit loop without needing real infrastructure
- The app proves which data model fields actually matter

Estimated time: 1-2 weeks

## Version 0.3 — Real Data Foundation

Goal: Persist the validated workflow with Supabase.

Features:

- Database setup
- Clients table
- Projects table
- Reminders table
- Notes table
- Basic CRUD

Success criteria:

- Projects, reminders, and notes persist reliably
- The dashboard reflects saved data instead of mock data
- The schema stays small and aligned with real usage

Estimated time: 2-3 weeks

## Version 0.4 — Daily-Use Hardening

Goal: Make Tempo comfortable enough for repeated real-world use.

Features:

- Mobile-friendly layout improvements
- Better empty states
- Cleaner project context and color usage
- Polished capture and review flows
- Basic data hygiene for editing and deleting items

Success criteria:

- Ray can use Tempo across multiple days without friction
- The interface feels clear on both desktop and mobile
- The product feels dependable before adding more scope

Estimated time: 1 week

## Version 0.5 — Privacy and Access

Goal: Add the minimum privacy layer needed for real use.

Features:

- Login
- User-owned data
- Protected routes

Success criteria:

- Ray can safely use real information in the app
- Access control does not complicate the core experience

Estimated time: 3-5 days

## Version 1.0 — Ray-Usable MVP

Goal: Ray can use Tempo daily.

Features:

- Dashboard
- Clients
- Projects
- Notes
- Reminders
- Weekly overview
- Mobile-friendly layout
- Project color-coding throughout the experience

Success criteria:

- Ray prefers checking Tempo over scattered notes for daily orientation
- The morning dashboard reliably answers what needs attention now
- Tempo supports the core personal workflow without requiring workarounds

Estimated time: Reach after 1-2 weeks of real usage feedback post-0.5

## Timeline Snapshot

- Tight scope, near full-time pace: 4-6 weeks
- Part-time but steady pace: 6-10 weeks
- Nights and weekends pace: 2-3 months

## Scope Guardrails

- Do not add AI before the core dashboard habit works
- Do not add calendar sync before the reminder and note workflow feels necessary
- Do not overbuild clients, payments, or file handling before Ray is using the dashboard consistently
