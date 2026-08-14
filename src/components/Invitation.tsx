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
    <main className="min-h-screen overflow-hidden bg-[#071A3D]">
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
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,_#17376d_0%,_#071a3d_55%,_#030d20_100%)]" />
            <div className="sparkle-gradient absolute inset-0" />

            {/* Stars */}
            <div className="pointer-events-none absolute inset-0">
              <span className="star absolute left-[15%] top-[18%] text-sm text-[#D8B76A]">
                ✦
              </span>

              <span className="star star-delay-1 absolute right-[18%] top-[25%] text-xs text-[#F0D99A]">
                ✧
              </span>

              <span className="star star-delay-2 star-mint absolute left-[25%] top-[68%] text-xs">
                ✦
              </span>

              <span className="star star-delay-3 absolute right-[22%] top-[72%] text-sm text-[#F0D99A]">
                ✧
              </span>

              <span className="star absolute left-[8%] top-[45%] text-[10px] text-[#D8B76A]">
                ✦
              </span>

              <span className="star star-delay-2 star-mint absolute right-[8%] top-[52%] text-[10px]">
                ✦
              </span>
            </div>

            {/* Opening content */}
            <div className="relative z-10 w-full max-w-md text-center">
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-xs uppercase tracking-[0.4em] text-[#D8B76A]"
              >
                A Special Invitations
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.4,
                  duration: 0.8,
                }}
                className="my-6 text-2xl text-[#D8B76A]"
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
                className="font-serif text-4xl text-[#FAF7F0] sm:text-5xl"
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

            <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,_#17376d_0%,_#071a3d_55%,_#030d20_100%)]" />
              <div className="sparkle-gradient absolute inset-0" />

              <div className="pointer-events-none absolute inset-0">
                <span className="star absolute left-[12%] top-[18%] text-sm text-[#D8B76A]">
                  ✦
                </span>

                <span className="star star-delay-1 absolute right-[15%] top-[24%] text-xs text-[#F0D99A]">
                  ✧
                </span>

                <span className="star star-delay-2 star-mint absolute left-[20%] top-[70%] text-xs">
                  ✦
                </span>

                <span className="star star-delay-3 absolute right-[20%] top-[68%] text-sm text-[#F0D99A]">
                  ✧
                </span>
              </div>

              <div className="relative z-10 w-full max-w-md text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-[#D8B76A]">
                  Please Join Us
                </p>

                <div className="my-7 text-2xl text-[#D8B76A]">
                  ✦
                </div>

                <h1 className="font-serif text-5xl leading-tight text-[#FAF7F0] sm:text-6xl">
                  Azarius
                  <br />
                  Niven
                </h1>

                <p className="mt-6 text-sm uppercase tracking-[0.3em] text-[#F0D99A]">
                  Is Turning
                </p>

                <p className="mt-2 font-serif text-7xl text-[#D8B76A]">
                  One
                </p>

                <div className="mx-auto my-8 h-px w-32 bg-gradient-to-r from-transparent via-[#D8B76A] via-70% to-[#3FA787]/40" />

                <p className="mx-auto max-w-sm text-sm leading-7 text-white/70">
                  One beautiful year filled with love, laughter, and
                  countless precious memories. Join us as we celebrate
                  this special milestone.
                </p>

                <div className="mt-10 text-xs uppercase tracking-[0.25em] text-white/40">
                  October 4, 2026
                </div>
              </div>
            </section>

            {/* ================================
                EVENT DETAILS
            ================================= */}

            <section className="bg-[#FAF7F0] px-6 py-20 text-[#172033]">
              <div className="mx-auto max-w-md text-center">
                <p className="text-xs uppercase tracking-[0.35em] text-[#A08445]">
                  Save the Date
                </p>

                <h2 className="mt-4 text-4xl text-[#071A3D]">
                  Join Us
                </h2>

                <div className="mx-auto my-8 h-px w-24 bg-[#D8B76A]" />

                <div className="mb-8">
                  <p className="text-xs uppercase tracking-[0.25em] text-[#A08445]">
                    Date
                  </p>

                  <p className="mt-2 font-serif text-2xl text-[#071A3D]">
                    Sunday, October 4, 2026
                  </p>
                </div>

                <div className="mb-8">
                  <p className="text-xs uppercase tracking-[0.25em] text-[#A08445]">
                    Time
                  </p>

                  <p className="mt-2 font-serif text-2xl text-[#071A3D]">
                    11:30 AM
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-[#A08445]">
                    Celebration
                  </p>

                  <p className="mt-2 font-serif text-2xl text-[#071A3D]">
                    Azarius&apos;s 1st Birthday
                  </p>
                </div>

                <Countdown />
              </div>
            </section>

            <Location />

            <RSVP />

            <Guestbook />

            <section className="bg-[#030D20] px-6 py-16">
                <div className="mx-auto max-w-md space-y-4">
                    <CalendarButton />
                    <ShareButton />
                </div>
            </section>

            {/* ================================
                FOOTER
            ================================= */}

            <footer className="bg-[#030D20] px-6 py-12 text-center">
              <div className="text-[#D8B76A]">
                ✦
              </div>

              <p className="mt-4 font-serif text-xl text-[#FAF7F0]">
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