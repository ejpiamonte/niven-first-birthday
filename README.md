# Niven’s First Birthday Invitation

A single-page birthday invitation built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and Framer Motion. Guests can view event details and photos, add the event to their calendar, submit an RSVP through Google Forms, and leave a guestbook message.

## Getting started

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Set up connected services and environment variables by following [SETUP.md](SETUP.md). Without those settings, the invitation renders, but RSVP counts, RSVP submissions, guestbook storage, and admin pages will not work fully.

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
- `public/images/`: invitation and gallery photos. The gallery expects `gallery-1.jpeg` through `gallery-16.jpeg`.
- `public/music/`: birthday audio.

## Admin pages

- `/dashboard`: Google Sheets RSVP responses and totals.
- `/admin`: guestbook administration.

Both pages use the `ADMIN_PASSWORD` environment variable. See [SETUP.md](SETUP.md) for service setup and security notes.

## Event details

The invitation and calendar event currently use October 4, 2026 at 11:30 AM (Philippine time), at “Our Home.” Update the displayed copy, countdown, and calendar route together if any event details change.

## Deployment

Deploy as a standard Next.js application (for example, on Vercel). Configure the required environment variables in the deployment environment before publishing. `NEXT_PUBLIC_*` values are embedded in browser code at build time; set them before building. See [SETUP.md](SETUP.md) for the full list.


## Shared Supabase setup

To share the existing Northstar project with LedgerLens and Niven, see [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) and [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md). Inspect hosted metadata before applying [the additive SQL](supabase/shared/002_add_to_existing_northstar.sql). The empty bootstrap is for empty destinations only. No existing records or files are imported. SQL execution against Supabase remains pending.
