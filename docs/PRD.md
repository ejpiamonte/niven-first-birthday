# Product requirements: Niven’s First Birthday invitation

**Status:** Describes the checked-in application as reviewed on 2026-10-13. Business goals and future changes below are inferred from the product shape and are not separately approved requirements.

## Purpose and users

The site presents a shareable digital invitation for Niven’s first birthday. Guests can view event details, browse photos, RSVP, leave a guestbook message, find the venue, and add the event to a calendar. Family administrators can review RSVPs and manage guestbook entries.

## Scope implemented

- Single-page invitation with envelope reveal, event details, countdown, map, photo gallery/lightbox, music, sharing, and calendar event.
- RSVP capture through Google Forms and aggregate/detail reads from its published response sheet.
- Supabase-backed public guestbook with per-entry edit token.
- Password-gated RSVP dashboard and guestbook admin pages.

Out of scope in the current code: user accounts, role-based admin users, payment, event registration limits, RSVP storage in Supabase, analytics, and automated RSVP confirmation.

## Users and permissions

- **Guest:** Publicly views the invitation and approved guestbook messages, submits RSVP and message, edits their own guestbook message with its token.
- **Administrator:** Uses one shared `ADMIN_PASSWORD` for both admin pages; views RSVP details and can approve/delete guestbook records.
- **Services:** Google Forms/Sheets handle RSVP data and contribute RSVP messages to the public guestbook; Supabase stores messages submitted through the guestbook form.

## Requirements and acceptance criteria

| Requirement | Acceptance criterion | Status |
| --- | --- | --- |
| Share an event invitation | Main route renders event copy, gallery, venue directions, and share/calendar actions | Implemented in source; not browser-tested in this documentation task |
| Collect RSVP answers | Configured form sends name, attendance, guest count, and optional message to Google Forms | Implemented; delivery cannot be verified by the client UI |
| Show attendance totals | Public counter returns attending-response and guest counts only; dashboard returns all response rows after password check | Implemented in source; external sheet configuration not verified |
| Collect birthday messages | Public guestbook shows name/message from RSVP Sheet and approved Supabase rows; owner edits Supabase entries with a matching token | Implemented in source; live integrations not verified |
| Administer content | Password-gated `/admin` displays parsed RSVP rows and guestbook approve/delete controls | Implemented in source; newly created messages are already approved |

There is no product analytics or automated success metric. Operational checks should confirm successful RSVP rows in the Google response sheet and guestbook rows in Supabase.

## Constraints and unresolved decisions

- The displayed event is October 4, 2026 at 11:30 AM Philippine time. That date is past as of 2026-10-13. Whether to archive the site, keep it as a memory page, or change it for another event is an owner decision.
- The copy and UI contain a few remaining “Azarius” references while the invitation identifies Niven. See the implementation plan for known discrepancies.
- Whether the guestbook should be pre-moderated is unresolved; current behavior publishes submissions immediately.
- A Supabase project sharing plan exists in `supabase/shared/`, but hosted target state and any source guestbook records to transfer must be confirmed before data work.
