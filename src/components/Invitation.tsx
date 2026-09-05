"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import CalendarButton from "./CalendarButton";
import Countdown from "./Countdown";
import Envelope from "./Envelope";
import Guestbook from "./Guestbook";
import Location from "./Location";
import MusicPlayer from "./MusicPlayer";
import PhotoLightbox from "./PhotoLightbox";
import RSVP from "./RSVP";
import ShareButton from "./ShareButton";
import { playUnsealChime } from "../lib/sound";

// Shared scroll-reveal: each section fades/rises into place once, the
// first time it enters the viewport — one quiet, consistent motion
// rather than a different effect per section.
const revealProps = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

// Replace /public/images/gallery-1.jpeg through gallery-16.jpeg with your
// own photos (keep the same filenames/count) to swap the gallery.
const GALLERY_COUNT = 16;
const GALLERY_IMAGES = Array.from(
  { length: GALLERY_COUNT },
  (_, i) => `/images/gallery-${i + 1}.jpeg`
);

// Scattered, independently-twinkling stars instead of a fixed grid of
// positions. Random positions are generated in useEffect (client-only,
// post-mount) rather than in a useState initializer — doing it during
// the initial render made the server's random values differ from the
// client's on hydration, which throws a hydration-mismatch error.
// Server and the first client render both output nothing, so they
// match; the stars populate a moment later, client-side only.
function StarField({ count = 14 }: { count?: number }) {
  const [stars] = useState(() =>
    Array.from({ length: count }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 68,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2.5,
      gold: Math.random() > 0.5,
    }))
  );

  return (
    <div className="pointer-events-none absolute inset-0">
      {stars.map((star, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            background: star.gold
              ? "var(--gold)"
              : "var(--star-white)",
            boxShadow: `0 0 ${star.size * 3}px ${
              star.gold ? "var(--gold)" : "var(--star-white)"
            }`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function Invitation() {
  const [isOpened, setIsOpened] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // The background track. Created once on mount, but NOT auto-played here
  // — browsers block audio autoplay on page load regardless of any code
  // trick. It's started from handleEnvelopeOpen below instead, inside the
  // same click that opens the envelope, which counts as a real user
  // gesture and is allowed to start audio.
  //
  // Save your file as public/music/happy-birthday.wav — lowercase, no
  // spaces. (A filename with a space or capital letters works fine on
  // Windows locally but can 404 once deployed, same issue as the earlier
  // image-casing bug.)
  useEffect(() => {
    const audio = new Audio("/music/happy-birthday.wav");
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  function handleEnvelopeOpen() {
    playUnsealChime();

    const audio = audioRef.current;
    if (audio) {
      audio
        .play()
        .then(() => setMusicPlaying(true))
        .catch(() => {
          // If a browser still blocks this, the floating music button is
          // the fallback — the guest can tap it to start the track.
        });
    }

    setIsOpened(true);
  }

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (musicPlaying) {
      audio.pause();
      setMusicPlaying(false);
      return;
    }

    audio
      .play()
      .then(() => setMusicPlaying(true))
      .catch(() => {
        console.log("Music playback was blocked.");
      });
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--coffee)]">
      <MusicPlayer playing={musicPlaying} onToggle={toggleMusic} />

      <PhotoLightbox
        images={GALLERY_IMAGES}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />

      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.section
            key="envelope"
            exit={{
              opacity: 0,
              scale: 1.05,
            }}
            transition={{
              duration: 0.8,
            }}
            className="story-night relative flex min-h-screen items-center justify-center overflow-hidden px-6"
          >
            <div className="story-mountains" />
            <div className="story-ground" />

            {/* Stars */}
            <StarField count={16} />

            {/* Opening content */}
            <div className="relative z-10 w-full max-w-md text-center">
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-xs uppercase tracking-[0.4em] text-[var(--gold)]"
              >
                A Special Invitation
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.4,
                  duration: 0.8,
                }}
                className="my-6 text-2xl text-[var(--gold)]"
              >
                ✦
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.6,
                  duration: 1,
                }}
                className="font-serif text-4xl text-[var(--cream)] sm:text-5xl"
              >
                You&apos;re Invited
              </motion.h1>

              <Envelope onOpen={handleEnvelopeOpen} />
            </div>
          </motion.section>
        ) : (
          <motion.div
            key="invitation"
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
          >
            {/* ================================
                HERO
            ================================= */}

            <section className="story-night relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-20">
              <div className="story-mountains" />
              <div className="story-ground" />

              <StarField count={20} />

              {/* Cactus pair — visible on all screen sizes now, spaced
                 apart so they don't collide with the centered photo/text
                 column even on narrow phones. Moved down to bottom-[2%]
                 (was bottom-[9%]) — the hero copy grew a bit taller since
                 this was tuned, and 9% was landing the cacti at the same
                 row as the date line, overlapping its left/right edges
                 on mobile. Scaled down slightly below the sm breakpoint
                 via the CSS media query in globals.css. */}
              <div className="pointer-events-none absolute inset-x-0 bottom-[2%] flex justify-center gap-24 sm:gap-40">
                <div className="cactus" />
                <div className="cactus" style={{ animationDelay: "1.4s" }} />
              </div>

              <div className="relative z-10 w-full max-w-md text-center">
                {/* Round photo — replace /public/images/baby-hero.jpg with
                   your own photo (keep the same filename) to swap it. */}
                <div className="lasso-border mx-auto mb-6 w-fit">
                  <div className="story-photo h-32 w-32 overflow-hidden rounded-full sm:h-36 sm:w-36">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/baby-hero.jpg"
                      alt="Azarius Niven"
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                </div>

                <p className="text-xs uppercase tracking-[0.4em] text-[var(--gold)]">
                  Please Join Us
                </p>

                <div className="my-7 text-2xl text-[var(--gold)]">✦</div>

                <h1 className="font-serif text-5xl leading-tight text-[var(--cream)] sm:text-6xl">
                  Azarius
                  <br />
                  Niven
                </h1>

                <p className="mt-6 text-sm uppercase tracking-[0.3em] text-[var(--dust)]">
                  Is Turning
                </p>

                <div className="sheriff-badge mx-auto mt-3 text-4xl">
                  1
                </div>

                <div className="mx-auto my-8 h-px w-32 bg-gradient-to-r from-transparent via-[var(--gold)] via-70% to-[var(--rust)]/40" />

                <p className="mx-auto mb-20 max-w-sm text-sm leading-7 text-[var(--cream)]/70">
                  Hi! We&apos;re inviting you to celebrate the 1st birthday of
                  our baby, Azarius Niven, on October 4, 2026 at 11:30 AM at
                  our home. Kindly RSVP on or before September 20, 2026.
                </p>

                {/* Fixed: was "mt -10" (a stray space breaks both "mt" and
                   "-10" as Tailwind classes, so this had no top margin at
                   all) — now the intended mt-10. */}
                <div className="mt-10 text-xs uppercase tracking-[0.25em] text-[var(--cream)]/40">
                  October 4, 2026
                </div>
              </div>
            </section>

            {/* ================================
                EVENT DETAILS
            ================================= */}

            <motion.section
              {...revealProps}
              className="story-paper relative overflow-hidden px-6 py-20 text-[var(--ink)]"
            >
              {/* One-shot tumbleweed, rolls through once per page load */}
              <div className="tumbleweed" aria-hidden="true" />

              <div className="relative mx-auto max-w-md text-center">
                <p className="text-xs uppercase tracking-[0.35em] text-[var(--brown)]">
                  Save the Date
                </p>

                <h2 className="mt-4 text-4xl text-[var(--navy)]">Join Us</h2>

                <div className="gold-rule my-8" />

                <div className="mb-8">
                  <p className="text-xs uppercase tracking-[0.25em] text-[var(--brown)]">
                    Date
                  </p>

                  <p className="mt-2 font-serif text-2xl text-[var(--navy)]">
                    Sunday, October 4, 2026
                  </p>
                </div>

                <div className="mb-8">
                  <p className="text-xs uppercase tracking-[0.25em] text-[var(--brown)]">
                    Time
                  </p>

                  <p className="mt-2 font-serif text-2xl text-[var(--navy)]">
                    11:30 AM
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-[var(--brown)]">
                    Celebration
                  </p>

                  <p className="mt-2 font-serif text-2xl text-[var(--navy)]">
                    Azarius&apos;s 1st Birthday
                  </p>
                </div>

                <Countdown />
              </div>
            </motion.section>

            <motion.div {...revealProps}>
              <Location />
            </motion.div>

            <motion.div {...revealProps}>
              <RSVP />
            </motion.div>

            {/* Round photo before the guestbook — replace
               /public/images/baby-closing.jpg with your own photo (keep
               the same filename) to swap it. */}
            <motion.section
              {...revealProps}
              className="bg-[var(--coffee)] px-6 pt-16"
            >
              <div className="mx-auto flex max-w-md flex-col items-center text-center">
                <div className="lasso-border w-fit">
                  <div className="story-photo h-28 w-28 overflow-hidden rounded-full sm:h-32 sm:w-32">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/baby-closing2.jpg"
                      alt="Azarius Niven smiling"
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                </div>

                <p className="mt-5 max-w-xs text-sm leading-7 text-[var(--cream)]/60">
                  We can&apos;t wait to celebrate this milestone with you.
                </p>
              </div>
            </motion.section>

            {/* ================================
                PHOTO GALLERY
            ================================= */}

            {/* Tap any photo to open it full-screen (zoom, pan, and
               step through all 16 via the lightbox above). */}
            <motion.section
              {...revealProps}
              className="bg-[var(--coffee)] px-6 py-20"
            >
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
                  Little Moments
                </p>

                <h2 className="mt-4 font-serif text-4xl text-[var(--cream)]">
                  A Year in Pictures
                </h2>

                <p className="mx-auto mt-3 max-w-sm text-xs uppercase tracking-[0.2em] text-[var(--cream)]/40">
                  Tap a photo to view it full-screen
                </p>
              </div>

              <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4">
                {GALLERY_IMAGES.map((src, i) => (
                  <motion.button
                    key={src}
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    aria-label={`Open photo ${i + 1} of ${GALLERY_IMAGES.length}`}
                    className="story-photo aspect-square cursor-zoom-in overflow-hidden rounded-2xl"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Azarius Niven — photo ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            </motion.section>

            <motion.div {...revealProps}>
              <Guestbook />
            </motion.div>

            <motion.section
              {...revealProps}
              className="bg-[var(--coffee-deep)] px-6 py-16"
            >
              <div className="mx-auto max-w-md space-y-4">
                <CalendarButton />
                <ShareButton />
              </div>
            </motion.section>

            {/* ================================
                FOOTER
            ================================= */}

            <footer className="bg-[var(--coffee-deep)] px-6 py-12 text-center">
              <div className="wheel-divider mb-6 justify-center">
                <span className="wheel-divider-hub" aria-hidden="true" />
              </div>

              <p className="font-serif text-xl text-[var(--cream)]">
                Azarius Niven
              </p>

              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-[var(--cream)]/40">
                One beautiful year
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}