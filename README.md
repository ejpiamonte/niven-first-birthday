# Niven’s First Birthday Invitation

A single-page birthday invitation built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and Framer Motion. Guests can view event details and photos, add the event to their calendar, submit an RSVP through Google Forms, and leave a guestbook message.

## Getting started

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Set up connected services and environment variables by following [setup and operations](docs/SETUP_AND_OPERATIONS.md). Without those settings, the invitation renders, but RSVP counts, RSVP submissions, guestbook storage, and admin pages will not work fully.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Project map

- `src/app/page.tsx` and `src/components/Invitation.tsx`: invitation page and section composition.
- `src/components/`: RSVP, guestbook, gallery, location, calendar, music, and other interface components.
- `src/app/api/`: RSVP count, guestbook, calendar, and admin route handlers.
- `src/lib/`: Google Forms submission, Google Sheets parsing, Supabase client, and sound helpers.
- `public/images/`: invitation artwork and photos. “Little Moments” currently displays 16 placeholders; the gallery image files are not shown.
- `public/music/`: birthday audio.

## Admin pages

- `/dashboard`: Google Sheets RSVP responses and totals (RSVP-only view).
- `/admin`: RSVP response sheet details and guestbook administration.

Both pages use the `ADMIN_PASSWORD` environment variable. See [setup and operations](docs/SETUP_AND_OPERATIONS.md) for service setup and security notes.

## Event details

The invitation and calendar event currently use October 4, 2026 at 11:30 AM (Philippine time), at “Our Home.” Update the displayed copy, countdown, and calendar route together if any event details change.

## Deployment

Deploy as a standard Next.js application (for example, on Vercel). Configure the required environment variables in the deployment environment before publishing. `NEXT_PUBLIC_*` values are embedded in browser code at build time; set them before building. See [setup and operations](docs/SETUP_AND_OPERATIONS.md) for the full list.

## Project documentation

- [Product requirements](docs/PRD.md)
- [Technical design](docs/TRD.md)
- [Application flows](docs/APP_FLOW.md)
- [Design brief](docs/DESIGN_BRIEF.md)
- [Database schema and data transfer notes](docs/DATABASE_SCHEMA.md)
- [Implementation and maintenance plan](docs/IMPLEMENTATION_PLAN.md)
- [Setup and operations](docs/SETUP_AND_OPERATIONS.md)

## Shared Supabase setup

This repository includes reviewed SQL artifacts for adding the Niven guestbook alongside the existing Northstar and LedgerLens schemas. These scripts create schema objects; they do not transfer existing guestbook rows. See the database and setup docs, inspect the hosted project before applying [the additive SQL](supabase/shared/002_add_to_existing_northstar.sql), and use the empty bootstrap only for a genuinely empty destination. Confirm the current hosted state before running any SQL.
