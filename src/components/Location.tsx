export default function Location() {
  return (
    <section className="bg-[#071A3D] px-6 py-20 text-white">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-[#D8B76A]">
          The Celebration
        </p>

        <h2 className="mt-4 font-serif text-4xl text-[#FAF7F0]">
          Shakey&apos;s Meycauayan
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/60">
          We&apos;d love to celebrate this special milestone with you.
        </p>

        {/* Map */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-[#D8B76A]/40 bg-[#030D20] shadow-2xl">
          <div className="relative aspect-[4/3] w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d405.5591626310331!2d120.97331912075985!3d14.749259381125011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b30077e0051d%3A0x306cd5c3e5457cd!2sShakeys%20Meycauayan!5e0!3m2!1sen!2sph!4v1786358587736!5m2!1sen!2sph"
              className="absolute inset-0 h-full w-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Shakey's Meycauayan location"
            />
          </div>
        </div>

        {/* Directions */}
        <a
          href="https://www.google.com/maps/search/?api=1&query=Shakey%27s%20Meycauayan"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#D8B76A] px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#071A3D] transition-transform active:scale-[0.98] sm:w-auto"
        >
          📍 Get Directions
        </a>
      </div>
    </section>
  );
}