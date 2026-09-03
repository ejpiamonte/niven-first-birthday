"use client";

import { motion } from "framer-motion";

type EnvelopeProps = {
  onOpen: () => void;
};

export default function Envelope({ onOpen }: EnvelopeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="relative mx-auto mt-10 w-full max-w-[320px] cursor-pointer"
      onClick={onOpen}
    >
      {/* Envelope shadow */}
      <div className="absolute -bottom-5 left-1/2 h-8 w-[80%] -translate-x-1/2 rounded-full bg-black/30 blur-xl" />

      {/* Envelope */}
      <div className="relative aspect-[1.45/1] overflow-hidden rounded-lg bg-[#4A2E1C] shadow-2xl">
        {/* Envelope texture */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(255,255,255,0.08),_transparent_40%)]" />

        {/* Bottom envelope flap */}
        <div
          className="absolute inset-x-0 bottom-0 z-20 h-[65%]"
          style={{
            clipPath: "polygon(0 100%, 50% 25%, 100% 100%)",
            background: "#5C3A22",
          }}
        />

        {/* Left fold */}
        <div
          className="absolute inset-y-0 left-0 z-10 w-1/2"
          style={{
            clipPath: "polygon(0 0, 100% 50%, 0 100%)",
            background: "#3A2313",
          }}
        />

        {/* Right fold */}
        <div
          className="absolute inset-y-0 right-0 z-10 w-1/2"
          style={{
            clipPath: "polygon(100% 0, 0 50%, 100% 100%)",
            background: "#4F3119",
          }}
        />

        {/* Gold border */}
        <div className="pointer-events-none absolute inset-3 z-30 rounded border border-[#C9973B]/60" />

        {/* Wax seal */}
        <motion.div
          animate={{
            scale: [1, 1.04, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-1/2 z-40 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#E8C87A] bg-[#C9973B] shadow-xl"
        >
          <span className="text-2xl">🤠</span>
        </motion.div>
      </div>

      {/* Tap instruction */}
      <motion.p
        animate={{
          opacity: [0.45, 1, 0.45],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="mt-6 text-center text-[10px] uppercase tracking-[0.3em] text-[#E8C87A]"
      >
        Tap to open
      </motion.p>
    </motion.div>
  );
}
