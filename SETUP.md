# Setup and operations

## 1. Install and run

Use Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Create a local `.env.local` in the project root for service configuration. Do not commit this file or put private credentials in any `NEXT_PUBLIC_*` variable.

## 2. Configure Google Forms RSVP

The RSVP component submits directly from the guest’s browser to a Google Form using a hidden iframe. Create a form with questions for name, attendance, guest count, and an optional message. The attendance multiple-choice options must match these strings exactly:

- `Yes, I'll be there!`
- `Regretfully Decline`

Find the form’s `formResponse` URL and each question’s `entry.<number>` field name (inspect the prefilled form URL or the form HTML). Set:

```dotenv
NEXT_PUBLIC_GFORM_ACTION_URL=https://docs.google.com/forms/d/e/FORM_ID/formResponse
NEXT_PUBLIC_GFORM_ENTRY_NAME=entry.000000001
NEXT_PUBLIC_GFORM_ENTRY_ATTENDING=entry.000000002
NEXT_PUBLIC_GFORM_ENTRY_GUESTS=entry.000000003
NEXT_PUBLIC_GFORM_ENTRY_MESSAGE=entry.000000004
```

Only the action URL, name field, and attendance field are required by the app. Guest count and message fields are optional. The `NEXT_PUBLIC_` values are public by design and are compiled into the browser bundle. The hidden iframe submission is fire-and-forget: the app cannot verify Google accepted a response from the browser.

## 3. Configure RSVP counts and dashboard

Link the Google Form to a response spreadsheet. Publish the response sheet (or the relevant response tab) as CSV and set its public CSV URL on the server:

```dotenv
GOOGLE_SHEET_CSV_URL=https://docs.google.com/spreadsheets/d/e/PUBLISHED_ID/pub?output=csv
```

The parser finds columns by header text. The sheet must have a name header containing `name`, an attendance header containing `joining`, a guest count header containing `guest`, and optionally `timestamp` and `message`. Attendance values must match `Yes, I'll be there!` to count as attending. Confirm the actual exported headers and values after changing the Google Form question labels.

The public `/api/rsvp` route returns only response and guest totals. `/dashboard` shows the individual rows and requires `ADMIN_PASSWORD`.

## 4. Configure the guestbook database

Create a Supabase project and a `guestbook` table. The server uses the Supabase service-role key, which bypasses Row Level Security; keep it only in server-side environment variables. A compatible schema is:

```sql
create table public.guestbook (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null,
  edit_token uuid not null default gen_random_uuid(),
  approved boolean not null default true,
  created_at timestamptz not null default now()
);
```

Add these server-side variables:

```dotenv
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
ADMIN_PASSWORD=choose-a-long-unique-password
```

The public guestbook route creates entries as approved immediately, and guests can edit their own entry using an edit token stored in their browser’s local storage. `/admin` can list, approve, or delete entries, but newly submitted messages are already public. Do not treat the admin page as a review queue unless that behavior is changed in the app.

The service-role key is highly privileged. Never rename it to a `NEXT_PUBLIC_*` variable, expose it in client components, or commit it. The admin password is sent to the server in a request header and stored in browser session storage for the current tab session; use HTTPS in production.

## 5. Optional site URL and assets

Set the deployed canonical URL for Open Graph metadata:

```dotenv
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

If omitted, metadata uses `http://localhost:3000`. Replace the gallery photos in `public/images/` while keeping the `gallery-1.jpeg` through `gallery-16.jpeg` filenames. Other invitation photos use `baby-hero.jpg`, `baby-closing.jpg`, and `baby-closing2.jpg`; the Open Graph image is `public/og-image.jpg`.

## 6. Build and deploy

```bash
npm run lint
npm run build
npm run start
```

Set all server variables in the hosting provider and set `NEXT_PUBLIC_*` values before the production build. The app’s API routes need a Node-compatible Next.js deployment. After deployment, check the invitation, calendar link, RSVP submission and response sheet, public RSVP count, guestbook create/edit, and both admin pages.

## Known implementation issues

- Several user-facing strings still say “Azarius” even though the invitation is for Niven: the RSVP thank-you and message placeholder, and the RSVP dashboard heading. These are visible copy bugs.
- The admin guestbook copy describes pending moderation, but public submissions are saved with `approved: true` and appear immediately. The pending list will normally be empty.
- The admin moderation UI does not check the HTTP response from its approve/reject request before refreshing. If the action fails on the server, the page does not show the route’s error and can look as if the action succeeded.
- RSVP submission shows a success screen after the browser submits the hidden Google Form iframe, but cross-origin restrictions prevent the app from confirming the submission reached Google. Check the response sheet when verifying delivery.
- The visual star field currently generates random values in a state initializer during render. Because the page is server-rendered, server and browser values can differ and cause a hydration mismatch. This should be moved to client-only post-mount generation.
