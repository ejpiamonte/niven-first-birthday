"use client";

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
        <p className="font-serif text-3xl text-[#071A3D]">
          🎉 Today is the day!
        </p>

        <p className="mt-2 text-sm text-[#667085]">
          We can&apos;t wait to celebrate with you.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <p className="mb-4 text-center text-xs uppercase tracking-[0.3em] text-[#A08445]">
        Counting Down
      </p>

      <div className="mx-auto grid max-w-[420px] grid-cols-2 gap-x-8 gap-y-3 px-4 text-center font-serif text-lg font-semibold text-[#071A3D] sm:text-xl">
        {[
          { value: timeLeft.days, label: "Days" },
          { value: timeLeft.hours, label: "Hours" },
          { value: timeLeft.minutes, label: "Minutes" },
          { value: timeLeft.seconds, label: "Seconds" },
        ].map((item) => (
          <span
            key={item.label}
            className="flex items-baseline justify-center gap-2"
          >
            <span>{padNumber(item.value)}</span>

            <span className="font-sans text-[10px] font-normal uppercase tracking-[0.1em] text-[#A08445] sm:text-sm">
              {item.label}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
