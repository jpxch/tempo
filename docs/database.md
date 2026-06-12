# Tempo Database Plan

Status: Draft.

No database will be implemented until the prototype and information architecture are validated.

## Database Timing

Supabase should be introduced only after the local workflow proves which fields and relationships are actually useful.

That means the database follows product validation, not the other way around.

## Likely Tables

- clients
- projects
- reminders
- notes
- payments
- events

## Core Relationship

A user has many clients.

A client has many projects.

A project can have many reminders, notes, events, and payments.

## Early Constraints

- Start single-user first
- Avoid adding optional tables before the dashboard needs them
- Keep reminders and notes flexible enough to support fast capture
- Preserve project color metadata so it can drive the UI consistently

## Not Needed Yet

- Collaboration tables
- Complex permissions
- Recurrence engine
- Calendar sync schema
- File attachment modeling

## Project Fields

- id
- user_id
- client_id
- name
- status
- color
- start_date
- due_date
- notes
- created_at
- updated_at
