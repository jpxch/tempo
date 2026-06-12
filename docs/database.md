# Tempo Database Plan

Status: Draft.

No database will be implemented until the static prototype is approved.

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
