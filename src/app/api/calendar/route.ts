// src/app/api/calendar/route.ts
import { NextResponse } from "next/server";

// Serves the calendar event as a real HTTP resource instead of a
// client-generated Blob. This is the fix for "Add to Calendar doesn't
// work on iPhone": iOS Safari (and in-app browsers like Messenger's,
// which is how most guests will open this) frequently ignore or block
// a JS-triggered Blob download via a synthetic <a download> click.
// Navigating to a real URL that returns Content-Type: text/calendar is
// the pattern iOS actually recognizes and offers to open in Calendar —
// and it works the same way on Android and desktop too.
export async function GET() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Niven Birthday//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:azarius-first-birthday-2026@azarius-niven-1st-birthday",
    "DTSTAMP:20260810T000000Z",
    "DTSTART:20261004T033000Z",
    "DTEND:20261004T063000Z",
    "SUMMARY:Niven 1st Birthday",
    "LOCATION:Our Home",
    "GEO:14.743929;120.967935",
    "DESCRIPTION:Join us as we celebrate Niven's 1st birthday! Directions: https://www.google.com/maps/dir/?api=1&destination=14.743929%2C120.967935",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new NextResponse(ics, {
    status: 200,
    headers: {
      // "inline" (not "attachment") is what lets iOS Safari offer to open
      // this directly in Calendar rather than just downloading a file.
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="azarius-first-birthday.ics"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}