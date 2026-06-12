# Tempo Architecture

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Radix UI
- Supabase
- Vercel

## App Structure

- app/ — routes and pages
- components/ — reusable UI and feature components
- lib/ — utilities and future Supabase client
- docs/ — product and technical planning

## Build Strategy

Start with a static prototype using fake data and validate the dashboard shape first.

Then move through these phases:

- Static prototype with realistic sample content
- Local state workflow for reminders, notes, and project context
- Supabase persistence for validated entities only
- Privacy and auth after the single-user workflow is dependable

## Design Principle

The dashboard is the product. Other modules support the dashboard.

## Product-Driven Technical Rules

- Optimize for fast capture and morning review before adding integrations
- Keep the initial data model small enough to change quickly
- Treat project color-coding as product behavior, not decorative styling
- Delay complex infrastructure until the core daily habit is proven
