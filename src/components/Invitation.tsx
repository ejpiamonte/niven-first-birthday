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

export default function Invitation() {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#2B1810]">
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
            className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,_#5c3a22_0%,_#2b1810_55%,_#1a0f09_100%)]" />
            <div className="sparkle-gradient absolute inset-0" />

            {/* Stars */}
            <div className="pointer-events-none absolute inset-0">
              <span className="star absolute left-[15%] top-[18%] text-sm text-[#C9973B]">
                ✦
              </span>

              <span className="star star-delay-1 absolute right-[18%] top-[25%] text-xs text-[#E8C87A]">
                ✧
              </span>

              <span className="star star-delay-2 star-rust absolute left-[25%] top-[68%] text-xs">
                ✦
              </span>

              <span className="star star-delay-3 absolute right-[22%] top-[72%] text-sm text-[#E8C87A]">
                ✧
              </span>

              <span className="star absolute left-[8%] top-[45%] text-[10px] text-[#C9973B]">
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
                className="text-xs uppercase tracking-[0.4em] text-[#C9973B]"
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
                className="my-6 text-2xl text-[#C9973B]"
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
                className="font-serif text-4xl text-[#F5EDE0] sm:text-5xl"
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

            <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,_#5c3a22_0%,_#2b1810_55%,_#1a0f09_100%)]" />
              <div className="sparkle-gradient absolute inset-0" />

              <div className="pointer-events-none absolute inset-0">
                <span className="star absolute left-[12%] top-[18%] text-sm text-[#C9973B]">
                  ✦
                </span>

                <span className="star star-delay-1 absolute right-[15%] top-[24%] text-xs text-[#E8C87A]">
                  ✧
                </span>

                <span className="star star-delay-2 star-rust absolute left-[20%] top-[70%] text-xs">
                  ✦
                </span>

                <span className="star star-delay-3 absolute right-[20%] top-[68%] text-sm text-[#E8C87A]">
                  ✧
                </span>
              </div>

              <div className="relative z-10 w-full max-w-md text-center">
                {/* Round photo — replace /public/images/baby-hero.jpg with
                   your own photo (keep the same filename) to swap it. */}
                <div className="mx-auto mb-6 h-32 w-32 overflow-hidden rounded-full sm:h-36 sm:w-36">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/baby-hero.JPG"
                    alt="Azarius Niven"
                    className="photo-frame h-full w-full rounded-full object-cover"
                  />
                </div>

                <p className="text-xs uppercase tracking-[0.4em] text-[#C9973B]">
                  Please Join Us
                </p>

                <div className="my-7 text-2xl text-[#C9973B]">
                  ✦
                </div>

                <h1 className="font-serif text-5xl leading-tight text-[#F5EDE0] sm:text-6xl">
                  Azarius
                  <br />
                  Niven
                </h1>

                <p className="mt-6 text-sm uppercase tracking-[0.3em] text-[#E8C87A]">
                  Is Turning
                </p>

                <p className="mt-2 font-serif text-7xl text-[#C9973B]">
                  One
                </p>

                <div className="mx-auto my-8 h-px w-32 bg-gradient-to-r from-transparent via-[#C9973B] via-70% to-[#B5651D]/40" />

                <p className="mx-auto max-w-sm text-sm leading-7 text-white/70">
                  Hi! We&apos;re inviting you to celebrate the 1st birthday of
                  our baby, Azarius Niven, on October 4, 2026 at 11:30 AM at
                  our home. Kindly RSVP on or before October 4, 2026.
                </p>

                <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-white/70">
                  No gifts are necessary — your presence is more than enough!
                  However, if you&apos;d like to celebrate Azarius&apos;s
                  first year with a gift, a monetary contribution toward his
                  future savings and dreams would be sincerely appreciated.
                </p>

                <div className="mt-10 text-xs uppercase tracking-[0.25em] text-white/40">
                  October 4, 2026
                </div>
              </div>
            </section>

            {/* ================================
                EVENT DETAILS
            ================================= */}

            <section className="bg-[#F5EDE0] px-6 py-20 text-[#2E1D12]">
              <div className="mx-auto max-w-md text-center">
                <p className="text-xs uppercase tracking-[0.35em] text-[#8B5E34]">
                  Save the Date
                </p>

                <h2 className="mt-4 text-4xl text-[#2B1810]">
                  Join Us
                </h2>

                <div className="mx-auto my-8 h-px w-24 bg-[#C9973B]" />

                <div className="mb-8">
                  <p className="text-xs uppercase tracking-[0.25em] text-[#8B5E34]">
                    Date
                  </p>

                  <p className="mt-2 font-serif text-2xl text-[#2B1810]">
                    Sunday, October 4, 2026
                  </p>
                </div>

                <div className="mb-8">
                  <p className="text-xs uppercase tracking-[0.25em] text-[#8B5E34]">
                    Time
                  </p>

                  <p className="mt-2 font-serif text-2xl text-[#2B1810]">
                    11:30 AM
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-[#8B5E34]">
                    Celebration
                  </p>

                  <p className="mt-2 font-serif text-2xl text-[#2B1810]">
                    Azarius&apos;s 1st Birthday
                  </p>
                </div>

                <Countdown />
              </div>
            </section>

            <Location />

            <RSVP />

            {/* Round photo before the guestbook — replace
               /public/images/baby-closing.jpg with your own photo (keep
               the same filename) to swap it. */}
            <section className="bg-[#2B1810] px-6 pt-16">
              <div className="mx-auto flex max-w-md flex-col items-center text-center">
                <div className="h-28 w-28 overflow-hidden rounded-full sm:h-32 sm:w-32">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/baby-closing2.jpg"
                    alt="Azarius Niven smiling"
                    className="photo-frame h-full w-full rounded-full object-cover"
                  />
                </div>

                <p className="mt-5 max-w-xs text-sm leading-7 text-white/60">
                  We can&apos;t wait to celebrate this milestone with you.
                </p>
              </div>
            </section>

            <Guestbook />

            <section className="bg-[#1A0F09] px-6 py-16">
                <div className="mx-auto max-w-md space-y-4">
                    <CalendarButton />
                    <ShareButton />
                </div>
            </section>

            {/* ================================
                FOOTER
            ================================= */}

            <footer className="bg-[#1A0F09] px-6 py-12 text-center">
              <div className="text-[#C9973B]">
                ✦
              </div>

              <p className="mt-4 font-serif text-xl text-[#F5EDE0]">
                Azarius Niven
              </p>

              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-white/40">
                One beautiful year
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
