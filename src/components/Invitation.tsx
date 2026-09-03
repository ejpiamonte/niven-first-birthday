"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import CalendarButton from "./CalendarButton";
import Countdown from "./Countdown";
import Envelope from "./Envelope";
import Guestbook from "./Guestbook";
import Location from "./Location";
import MusicPlayer from "./MusicPlayer";
import RSVP from "./RSVP";
import ShareButton from "./ShareButton";

// Shared scroll-reveal: each section fades/rises into place once, the
// first time it enters the viewport — one quiet, consistent motion
// rather than a different effect per section.
const revealProps = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

export default function Invitation() {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--navy)]">
      <MusicPlayer />

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
            <div className="pointer-events-none absolute inset-0">
              <span className="star absolute left-[15%] top-[18%] text-sm text-[var(--gold)]">
                ✦
              </span>

              <span className="star star-delay-1 absolute right-[18%] top-[25%] text-xs text-[var(--dust)]">
                ✧
              </span>

              <span className="star star-delay-2 star-rust absolute left-[25%] top-[68%] text-xs">
                ✦
              </span>

              <span className="star star-delay-3 absolute right-[22%] top-[72%] text-sm text-[var(--dust)]">
                ✧
              </span>

              <span className="star absolute left-[8%] top-[45%] text-[10px] text-[var(--gold)]">
                ✦
              </span>

              <span className="star star-delay-2 star-rust absolute right-[8%] top-[52%] text-[10px]">
                ✦
              </span>
            </div>

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

              <Envelope onOpen={() => setIsOpened(true)} />
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

              <div className="pointer-events-none absolute inset-0">
                <span className="star absolute left-[12%] top-[18%] text-sm text-[var(--gold)]">
                  ✦
                </span>

                <span className="star star-delay-1 absolute right-[15%] top-[24%] text-xs text-[var(--dust)]">
                  ✧
                </span>

                <span className="star star-delay-2 star-rust absolute left-[20%] top-[70%] text-xs">
                  ✦
                </span>

                <span className="star star-delay-3 absolute right-[20%] top-[68%] text-sm text-[var(--dust)]">
                  ✧
                </span>
              </div>

              {/* Corner cacti — small, still, a quiet frontier detail */}
              <div className="pointer-events-none absolute bottom-[8%] left-[6%] hidden sm:block">
                <div className="cactus" />
              </div>
              <div className="pointer-events-none absolute bottom-[8%] right-[6%] hidden sm:block">
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

                <p className="mx-auto max-w-sm text-sm leading-7 text-[var(--cream)]/70">
                  Hi! We&apos;re inviting you to celebrate the 1st birthday of
                  our baby, Azarius Niven, on October 4, 2026 at 11:30 AM at
                  our home. Kindly RSVP on or before October 4, 2026.
                </p>

                <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-[var(--cream)]/70">
                  No gifts are necessary — your presence is more than enough!
                  However, if you&apos;d like to celebrate Azarius&apos;s
                  first year with a gift, a monetary contribution toward his
                  future savings and dreams would be sincerely appreciated.
                </p>

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
              className="bg-[var(--navy)] px-6 pt-16"
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

            <motion.div {...revealProps}>
              <Guestbook />
            </motion.div>

            <motion.section
              {...revealProps}
              className="bg-[var(--night)] px-6 py-16"
            >
              <div className="mx-auto max-w-md space-y-4">
                <CalendarButton />
                <ShareButton />
              </div>
            </motion.section>

            {/* ================================
                FOOTER
            ================================= */}

            <footer className="bg-[var(--night)] px-6 py-12 text-center">
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