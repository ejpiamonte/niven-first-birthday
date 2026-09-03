"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const TARGET_DATE = new Date("2026-10-04T11:30:00+08:00").getTime();

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function calculateTimeLeft(): TimeLeft {
  const difference = TARGET_DATE - Date.now();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor(
      (difference / (1000 * 60 * 60)) % 24
    ),
    minutes: Math.floor(
      (difference / (1000 * 60)) % 60
    ),
    seconds: Math.floor(
      (difference / 1000) % 60
    ),
  };
}

function padNumber(number: number) {
  return number.toString().padStart(2, "0");
}

// A single wooden placard whose number rolls over like an odometer digit
// whenever the value changes — the only continuously "ticking" motion on
// the page, so it stays the one thing your eye is drawn to here.
// The clipping box below carries the `.countdown-number` class itself
// (font-size/line-height come from there), so `h-[1em]` resolves against
// the actual digit size instead of the container's inherited default.
// The animated span is `absolute inset-0` so the outgoing/incoming digit
// overlap in place during the flip instead of shoving layout around.
function FlipCard({ value, label }: { value: number; label: string }) {
  const display = padNumber(value);

  return (
    <div className="countdown-card">
      <div className="countdown-number relative h-[1em] overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={display}
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <p className="countdown-label">{label}</p>
    </div>
  );
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    function tick() {
      setTimeLeft(calculateTimeLeft());
    }

    // Deferred to a microtask (rather than called synchronously here) so
    // this doesn't run as a direct setState-in-effect-body call — it still
    // fires before the browser's next paint, so there's no visible delay.
    queueMicrotask(tick);

    const timer = setInterval(tick, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) {
    return null;
  }

  const isEventDay =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  if (isEventDay) {
    return (
      <div className="mt-10 text-center">
        <p className="font-serif text-3xl text-[var(--ink)]">
          🎉 Today is the day!
        </p>

        <p className="mt-2 text-sm text-[var(--muted)]">
          We can&apos;t wait to celebrate with you.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="wheel-divider mb-5">
        <span className="wheel-divider-hub" aria-hidden="true" />
      </div>

      <p className="mb-4 text-center text-xs uppercase tracking-[0.3em] text-[var(--brown)]">
        Counting Down
      </p>

      <div className="countdown-grid mx-auto max-w-[280px]">
        <FlipCard value={timeLeft.days} label="Days" />
        <FlipCard value={timeLeft.hours} label="Hours" />
        <FlipCard value={timeLeft.minutes} label="Minutes" />
        <FlipCard value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  );
}