// src/components/CalendarButton.tsx
// A plain link, not a JS-triggered download or data: URI — those are the
// two approaches that turned out unreliable on iOS (the data: URI just
// loaded a blank/blocked navigation with no calendar prompt). This
// navigates to a real URL at /api/calendar/route.ts that returns
// Content-Type: text/calendar, which is the pattern iOS Safari (and
// Messenger's in-app browser) actually recognizes and offers to open in
// Calendar. No "use client" needed since there's no interactivity left.
export default function CalendarButton() {
  return (
    <a
      href="/api/calendar"
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full rounded-full border border-[var(--gold)] bg-transparent px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)] transition hover:bg-[var(--gold)] hover:text-[var(--coffee)]"
    >
      📅 Add to Calendar
    </a>
  );
}