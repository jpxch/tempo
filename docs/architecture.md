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

Start with a static prototype using fake data.

Once the dashboard experience feels right, connect real data with Supabase.

## Design Principle

The dashboard is the product. Other modules support the dashboard.
