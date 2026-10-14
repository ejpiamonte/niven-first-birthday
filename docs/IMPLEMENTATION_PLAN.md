# Implementation and maintenance plan

**Status:** Planning notes based on the checked-in project as reviewed on 2026-10-14. This document does not authorize production changes or data imports.

## Current baseline

- Invitation, RSVP, guestbook, admin pages, public APIs, and static assets are implemented.
- Project scripts provide `lint`, `build`, `dev`, and `start`; no dedicated automated test script is defined in `package.json`.
- Google Forms/Sheets and Supabase are external runtime dependencies. Local production-mode endpoint checks confirmed the configured response Sheet is readable; Supabase connectivity was unavailable in the test runtime.
- The project includes proposed shared Supabase SQL scripts. Their execution against a hosted project and the migration of any existing guestbook rows must be confirmed separately.

## Workstreams and acceptance

| Phase | Work | Acceptance |
| --- | --- | --- |
| A. Confirm event lifecycle | Decide whether to archive the October 4, 2026 event site, preserve it as a memory page, or repurpose it | Owner decision is recorded before changing event-facing copy or dates |
| B. Confirm data source/target | Identify the old guestbook project, target shared project, table schema, row count, and whether existing entries must remain editable | Source/target facts and backups are documented; no live data changed during discovery |
| C. Prepare data transfer | Compare schema and conflicts; choose a selective guestbook-only transfer path | Import plan preserves required fields and lists any transformed records; reviewed before execution |
| D. Verify behavior | Run lint/build and manually inspect main flows; test guestbook against configured Supabase and RSVP against configured Form/Sheet where authorized | Actual outcomes/errors are recorded; external service checks are labeled as live tests |
| E. Resolve known defects | Correct name inconsistencies, hydration mismatch, moderation behavior/UI, admin action error handling, and accessibility gaps after owner agrees scope | Fixes have focused regression checks and docs accurately describe resulting behavior |

## Known discrepancies and risks

- RSVP success UI cannot confirm the hidden iframe request reached Google Forms.
- Star field uses random values during server/client rendering and may trigger hydration warnings.
- Several user-facing strings retain the former name “Azarius”.
- Guestbook entries are approved and public immediately, while the admin UI presents a pending queue.
- Guestbook API is public and has no rate limiting or pre-publication spam review.
- Event date has passed relative to this review; keeping an active countdown/invitation may be misleading.
- Guestbook edit access depends on a bearer token in one browser's local storage; there is no account recovery.

## Verification strategy

Use `npm run lint` and `npm run build` for static checks. Manually review envelope opening/music, responsive layout, gallery/lightbox keyboard controls, calendar response, RSVP submission and resulting Sheet row, public aggregate counts, guestbook create/list/edit authorization, and admin authorization/action failures. Use non-sensitive test records and remove them only with explicit approval.

### Verification recorded 2026-10-14

- `npm run lint`: passed after the dashboard effect cleanup.
- `npm run build`: passed; Next.js generated the `/admin`, `/dashboard`, and API routes.
- Production-mode local request to `/api/admin/rsvps`: HTTP 200, 25 rows, 21 with messages. Output inspection was limited to counts and field names; no row contents were printed.
- Production-mode local request to `/api/guestbook`: HTTP 200, 21 sheet-derived messages; each public object contained only `id`, `name`, and `message`.
- The Supabase read failed with DNS resolution error in the test runtime. The endpoint returned the Sheet messages and a warning; Supabase-backed guestbook rows and writes remain unverified. Confirm the Supabase URL and connectivity in the deployed runtime.
- No actual Google Form submission, live browser session, or hosted Supabase operation was performed.

## Approval boundaries

Live SQL execution, guestbook data import, deployment environment changes, deletes, and production deployment require a separate review and explicit approval. Back up source and target before data migration. Never use the empty-destination bootstrap against the existing Northstar database.
