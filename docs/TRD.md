# Technical design: Niven’s First Birthday invitation

**Status:** Current implementation summarized from the repository on 2026-10-13. Hosting configuration and live third-party settings are not verified here.

## Stack and structure

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Framer Motion.
- `src/app/page.tsx` renders the invitation component tree; `src/app/layout.tsx` defines fonts and metadata.
- `src/components/` contains guest-facing UI; `src/app/api/` contains server route handlers; `src/lib/` contains Google Forms, Google Sheets parsing, Supabase client, and sound helpers.
- Static images/audio live in `public/`.

## Integrations and data paths

### RSVP

The browser posts fields directly to the configured Google Forms `formResponse` endpoint through a hidden iframe. The browser cannot read the cross-origin response and the UI therefore cannot confirm that Google stored the answer. A server helper fetches the published Google Sheets CSV without caching, parses columns by header text, and supplies counts to `/api/rsvp` and rows to `/api/admin/rsvps`.

### Guestbook

The browser calls `/api/guestbook` for list/create/update. The API GET combines non-empty name/message fields from the published Google Sheet with approved Supabase guestbook entries and returns only an opaque id, name, and message to the public UI. If one source fails, available messages are returned with a warning; if both fail, the route returns an error. Supabase uses `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`; the service-role client bypasses RLS. POST marks entries approved immediately. PATCH compares the stored edit token before updating. Admin endpoints check `x-admin-password` against `ADMIN_PASSWORD` before reading/modifying rows. `/admin` checks both guestbook-admin and RSVP responses separately, so RSVP data can be displayed alongside guestbook controls.

### Calendar and static assets

`/api/calendar` returns a fixed iCalendar event. The event time is authored as UTC corresponding to the Philippine local time. Photos, music, and the map embed are loaded from local public assets or Google Maps.

## Routes

| Path | Method | Access | Purpose |
| --- | --- | --- | --- |
| `/` | GET | Public | Invitation page |
| `/api/rsvp` | GET | Public | Attending-response count and total attending guests only |
| `/api/guestbook` | GET | Public | List name/message entries from the Sheet and approved Supabase rows |
| `/api/guestbook` | POST | Public | Create approved entry; returns id and edit token |
| `/api/guestbook` | PATCH | Public with entry token | Edit an entry after token comparison |
| `/api/calendar` | GET | Public | Return fixed `.ics` event |
| `/api/admin` | GET | Shared password header | List Supabase guestbook rows |
| `/api/admin/moderate` | POST | Shared password header | Approve or delete a guestbook row |
| `/api/admin/rsvps` | GET | Shared password header | Read response sheet rows and totals for `/admin` and `/dashboard` |
| `/admin` | GET | UI password prompt | RSVP response sheet overview and guestbook admin UI |
| `/dashboard` | GET | UI password prompt | RSVP dashboard |

## Security and privacy

- Keep the Supabase service-role key and `ADMIN_PASSWORD` server-only. Do not use a `NEXT_PUBLIC_` prefix for these values.
- Google Forms field identifiers and the public form endpoint are client-visible configuration, not secrets.
- Admin access is one shared password header; the UI stores it in session storage. There is no user identity, role model, rate limiting, or lockout implemented in these routes.
- Guestbook edit tokens are bearer secrets in local storage. Anyone with the token can edit that entry.
- RSVP names/messages are returned from the authenticated dashboard endpoint. The public counter returns aggregates only.
- React renders guestbook content as text. Do not change to raw HTML rendering without sanitization and review.

## Configuration

See [SETUP_AND_OPERATIONS.md](SETUP_AND_OPERATIONS.md) for environment-variable names and service setup. The shared-password `/admin` page requests `/api/admin` (Supabase guestbook controls) and `/api/admin/rsvps` (Google Sheet rows). `NEXT_PUBLIC_*` variables are compiled into client code at build time. The actual `.env.local` is excluded from Git and must not be read into logs or documentation.

## Risks and unknowns

- Local production-mode checks verified the published Sheet can be read. Supabase DNS resolution failed in the local test runtime; the configured project reference and deployed runtime connectivity remain unverified.
- The app uses a privileged service-role key for all guestbook API operations; compromise exposes all tables accessible to that key within the project.
- Google Form submission is fire-and-forget; duplicate retries can create duplicate responses.
- Star positions are generated with `Math.random()` in a state initializer in a server-rendered component, so server/client markup can differ during hydration.
- Public guestbook creation has no rate limit or spam moderation before publication.
