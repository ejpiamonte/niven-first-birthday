# Application flows

**Status:** Based on current code; third-party connectivity and production behavior are not verified in this document update.

## Guest invitation

1. Guest opens `/` and sees the invitation envelope.
2. Guest opens it; the invitation content appears, the unseal sound plays, and background music is attempted as part of the user gesture. If browser audio is blocked, the music control provides another attempt.
3. Guest scrolls through event details/countdown, venue map and directions, RSVP, gallery/lightbox, guestbook, calendar, and sharing actions.
4. Gallery photos open in a dialog with previous/next, zoom, drag, close, Escape, and arrow-key controls.

## RSVP submission and display

1. Guest selects attendance and enters a name; guest count is shown unless declining, and is constrained in the UI to 1–10. Message is optional.
2. Client submits configured Google Form fields to the hidden iframe. Required form identifiers must be present; otherwise the client displays an error.
3. After a short delay the helper resolves and the UI displays a success state. That state means the form submission was attempted; it does not prove Google accepted it.
4. Google Forms stores the response in its linked Sheet. Server-side CSV parsing uses header text to find fields and exact attendance-label matching to count attendees.
5. `/api/rsvp` returns aggregate counts for the public display. `/dashboard` requires the shared admin password to return row-level responses. Configuration/fetch/parse errors produce API errors; the UI may show an error or omit the public count.

## Guestbook lifecycle

1. Client loads `/api/guestbook` and `/api/rsvp`, and attempts to load the current browser's guestbook edit token from local storage.
2. `/api/guestbook` combines non-empty name/message values from the Google response Sheet with approved Supabase guestbook rows. The public response contains only an opaque id, name, and message; list items render only name and message.
3. If one source fails, available messages are returned with a warning. If both sources fail, the UI displays an error. A successfully fetched empty source returns no entries.
4. First-time message submission sends name/message. The API trims and truncates values, writes a Supabase row as approved, and returns `id` plus `editToken`.
5. Client stores those values locally; message is immediately public. On later visits in the same browser profile, the form shows the saved entry and allows editing.
6. Edit sends id, edit token, and new text. The server compares the token with the stored token and returns 403 on mismatch; valid updates remain approved.
7. A user who clears local storage or changes browser/device loses the locally stored edit token unless separately backed up; no account recovery flow exists.

## Admin workflows

1. `/admin` and `/dashboard` accept the shared password, send it in `x-admin-password`, and store a successful password in tab-scoped session storage.
2. `/admin` loads guestbook controls from Supabase and all parsed RSVP rows from the published response Sheet. It displays timestamp, name, attendance, guest count, and message.
3. `/admin` lists pending and published guestbook entries and can approve or delete a row. Current public creation sets `approved=true`, so new entries appear as published, not pending.
4. `/dashboard` remains as the separate RSVP-only view with all/attending/declined filters.
5. Missing server password returns 500; invalid password returns 401. `/admin` reports sheet loading failures separately from guestbook/admin loading failures. Failed moderation responses are now shown in the admin UI rather than being treated as successful refreshes.

## Calendar and sharing

- Calendar action opens `/api/calendar`, which returns a fixed `.ics` representation with the event date, time, venue label, coordinates, and directions URL.
- Share uses the Web Share API where available and otherwise copies the configured hard-coded deployed URL to the clipboard. Share cancellation is ignored; clipboard failure is logged.

## Retry and recovery behavior

- RSVP: UI permits another submission after an error but cannot distinguish a Google rejection from a success. Check the response Sheet before manually resubmitting to avoid duplicates.
- Guestbook create/edit: client reports returned API errors and connection errors. If the server saves an entry but the response is lost, retrying create may create a duplicate; no idempotency key is used.
- Guestbook list/count: errors do not have an explicit retry control in the guest-facing UI; reload the page to try again.
- Admin actions: moderation errors are displayed; if a connection fails, refresh to verify whether the action took effect.
- Calendar: fixed event data is generated on each request; update app copy, countdown, metadata, and `.ics` fields together when event details change.
