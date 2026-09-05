// src/components/Location.tsx
// Converted from the DMS coordinates you gave:
//   Home: 14.743929, 120.967935
const HOME_COORDS = { lat: 14.743929, lng: 120.967935 };

export default function Location() {
  return (
    <section className="bg-[var(--coffee)] px-6 py-20 text-white">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          The Celebration
        </p>

        <h2 className="mt-4 font-serif text-4xl text-[var(--cream)]">
          Our Home
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/60">
          We&apos;d love to celebrate this special milestone with you.
        </p>

        {/* Map */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--gold)]/40 bg-[var(--coffee-deep)] shadow-2xl">
          <div className="relative aspect-[4/3] w-full">
            <iframe
              src={`https://maps.google.com/maps?q=${HOME_COORDS.lat},${HOME_COORDS.lng}&z=18&output=embed`}
              className="absolute inset-0 h-full w-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Our home location"
            />
          </div>
        </div>

        {/* Directions */}
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${HOME_COORDS.lat}%2C${HOME_COORDS.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[var(--gold)] px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--coffee)] transition-transform active:scale-[0.98] sm:w-auto"
        >
          📍 Get Directions
        </a>
      </div>
    </section>
  );
}