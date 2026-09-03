"use client";

import { motion } from "framer-motion";
import { useState } from "react";

type EnvelopeProps = {
  onOpen: () => void;
};

// Dust motes burst outward from the seal on tap — angle/distance pairs,
// not random per render, so the burst reads as designed rather than jittery.
const DUST = [
  { angle: -60, dist: 46 },
  { angle: -20, dist: 58 },
  { angle: 20, dist: 50 },
  { angle: 60, dist: 60 },
  { angle: 120, dist: 52 },
  { angle: 160, dist: 58 },
  { angle: -120, dist: 50 },
  { angle: -160, dist: 46 },
];

export default function Envelope({ onOpen }: EnvelopeProps) {
  const [isBreaking, setIsBreaking] = useState(false);

  function handleTap() {
    if (isBreaking) return;
    setIsBreaking(true);
    // Let the seal-crack + dust burst play before the parent swaps content.
    setTimeout(onOpen, 420);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="relative mx-auto mt-10 w-full max-w-[320px] cursor-pointer"
      onClick={handleTap}
    >
      {/* Envelope shadow */}
      <div className="absolute -bottom-5 left-1/2 h-8 w-[80%] -translate-x-1/2 rounded-full bg-black/30 blur-xl" />

      {/* Envelope */}
      <motion.div
        animate={isBreaking ? { y: [0, -4, 0] } : {}}
        transition={{ duration: 0.35 }}
        className="relative aspect-[1.45/1] overflow-hidden rounded-lg bg-[var(--navy)] shadow-2xl"
      >
        {/* Envelope texture */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(255,255,255,0.08),_transparent_40%)]" />

        {/* Bottom envelope flap */}
        <div
          className="absolute inset-x-0 bottom-0 z-20 h-[65%]"
          style={{
            clipPath: "polygon(0 100%, 50% 25%, 100% 100%)",
            background: "var(--blue)",
          }}
        />

        {/* Left fold */}
        <div
          className="absolute inset-y-0 left-0 z-10 w-1/2"
          style={{
            clipPath: "polygon(0 0, 100% 50%, 0 100%)",
            background: "var(--night)",
          }}
        />

        {/* Right fold */}
        <div
          className="absolute inset-y-0 right-0 z-10 w-1/2"
          style={{
            clipPath: "polygon(100% 0, 0 50%, 100% 100%)",
            background: "var(--navy)",
          }}
        />

        {/* Gold border */}
        <div className="pointer-events-none absolute inset-3 z-30 rounded border border-[var(--gold)]/60" />

        {/* Dust burst, hidden until the seal breaks */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-40 h-0 w-0">
          {DUST.map((d, i) => {
            const rad = (d.angle * Math.PI) / 180;
            const x = Math.cos(rad) * d.dist;
            const y = Math.sin(rad) * d.dist;
            return (
              <motion.span
                key={i}
                className="absolute block h-1.5 w-1.5 rounded-full bg-[var(--gold)]"
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.6 }}
                animate={
                  isBreaking
                    ? { opacity: [1, 0], x, y, scale: [0.6, 1, 0.4] }
                    : { opacity: 0 }
                }
                transition={{ duration: 0.55, ease: "easeOut" }}
              />
            );
          })}
        </div>

        {/* Wax seal */}
        <motion.div
          animate={
            isBreaking
              ? { scale: [1, 1.12, 0.85], rotate: [0, -8, 10] }
              : { scale: [1, 1.04, 1] }
          }
          transition={
            isBreaking
              ? { duration: 0.42, ease: "easeOut" }
              : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
          }
          className="absolute left-1/2 top-1/2 z-40 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[var(--gold)] bg-[var(--rust)] shadow-xl"
        >
          <span className="text-2xl">🤠</span>
          {/* Crack line, only visible mid-break */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: isBreaking ? 1 : 0 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(115deg, transparent 46%, rgba(23,50,74,.55) 49%, transparent 53%)",
            }}
          />
        </motion.div>
      </motion.div>

      {/* Tap instruction */}
      <motion.p
        animate={{
          opacity: [0.45, 1, 0.45],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="mt-6 text-center text-[10px] uppercase tracking-[0.3em] text-[var(--gold)]"
      >
        Tap to break the seal
      </motion.p>
    </motion.div>
  );
}