"use client";

function downloadCalendarFile() {
  const event = [
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

  const blob = new Blob([event], {
    type: "text/calendar;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "Azarius-first-birthday.ics";
  link.click();

  URL.revokeObjectURL(url);
}

export default function CalendarButton() {
  return (
    <button
      onClick={downloadCalendarFile}
      className="w-full rounded-full border border-[#C9973B] bg-transparent px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#C9973B] transition hover:bg-[#C9973B] hover:text-[#2B1810]"
    >
      📅 Add to Calendar
    </button>
  );
}
