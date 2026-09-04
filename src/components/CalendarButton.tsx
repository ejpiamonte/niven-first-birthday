"use client";

function isIOS() {
  if (typeof navigator === "undefined") return false;

  const ua = navigator.userAgent;

  // iPadOS 13+ identifies itself as "Macintosh" in the UA string, unlike
  // a real Mac it also reports multi-touch support — that's how we tell
  // them apart.
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (ua.includes("Macintosh") && navigator.maxTouchPoints > 1)
  );
}

function buildCalendarEvent() {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Azarius Birthday//EN",
    "BEGIN:VEVENT",
    "UID:Azarius-first-birthday-2026@example.com",
    "DTSTAMP:20260810T000000Z",
    "DTSTART:20261004T033000Z",
    "DTEND:20261004T063000Z",
    "SUMMARY:Azarius's 1st Birthday",
    "LOCATION:Our Home",
    "GEO:14.743929;120.967935",
    "DESCRIPTION:Join us as we celebrate Azarius Niven's first birthday! Directions: https://www.google.com/maps/dir/?api=1&destination=14.743929%2C120.967935",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function downloadCalendarFile() {
  const event = buildCalendarEvent();

  // iOS Safari doesn't reliably trigger "Add to Calendar" for a blob: URL
  // downloaded via a synthetic <a> click — it tends to just open the raw
  // .ics text in a tab instead. Navigating directly to a data: URI is the
  // path that reliably opens the native calendar preview on iOS. Every
  // other browser handles the blob download below just fine, so this is
  // the only special case needed.
  if (isIOS()) {
    const dataUri = `data:text/calendar;charset=utf-8,${encodeURIComponent(event)}`;
    window.location.href = dataUri;
    return;
  }

  const blob = new Blob([event], {
    type: "text/calendar;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "Azarius-first-birthday.ics";

  // Attaching to the document before .click() is needed for reliable
  // firing on some browsers (older Android WebViews in particular).
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export default function CalendarButton() {
  return (
    <button
      onClick={downloadCalendarFile}
      className="w-full rounded-full border border-[var(--gold)] bg-transparent px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)] transition hover:bg-[var(--gold)] hover:text-[var(--coffee)]"
    >
      📅 Add to Calendar
    </button>
  );
}