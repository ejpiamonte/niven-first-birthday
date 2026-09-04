"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type PhotoLightboxProps = {
  images: string[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.75;

export default function PhotoLightbox({
  images,
  index,
  onClose,
  onNavigate,
}: PhotoLightboxProps) {
  const [zoom, setZoom] = useState(1);
  const isOpen = index !== null;

  // Reset zoom whenever a different photo is shown. Deferred to a
  // microtask (rather than called synchronously here) so this isn't a
  // direct setState-in-effect-body call — it still resolves before the
  // next paint, so there's no visible delay.
  useEffect(() => {
    queueMicrotask(() => setZoom(1));
  }, [index]);

  // Lock page scroll while open, and wire up Escape / arrow keys.
  useEffect(() => {
    if (!isOpen || index === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowRight") {
        onNavigate(((index as number) + 1) % images.length);
      } else if (event.key === "ArrowLeft") {
        onNavigate(((index as number) - 1 + images.length) % images.length);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, index, images.length, onClose, onNavigate]);

  function zoomIn() {
    setZoom((current) => Math.min(MAX_ZOOM, current + ZOOM_STEP));
  }

  function zoomOut() {
    setZoom((current) => Math.max(MIN_ZOOM, current - ZOOM_STEP));
  }

  function toggleZoom() {
    setZoom((current) => (current > 1 ? 1 : 2.25));
  }

  return (
    <AnimatePresence>
      {isOpen && index !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-[100] flex flex-col bg-black/92 backdrop-blur-sm"
          // Clicking the backdrop closes; clicking the image/controls
          // themselves is stopped from bubbling up to this handler below.
          onClick={onClose}
        >
          {/* Top bar: counter + close */}
          <div
            className="flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))]"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-[var(--cream)]">
              {index + 1} / {images.length}
            </span>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close photo viewer"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-xl text-[var(--cream)] transition hover:bg-white/20"
            >
              ✕
            </button>
          </div>

          {/* Image stage */}
          <div
            className="relative flex flex-1 items-center justify-center overflow-hidden px-4"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Prev arrow */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  onNavigate((index - 1 + images.length) % images.length)
                }
                aria-label="Previous photo"
                className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-xl text-[var(--cream)] transition hover:bg-white/20 sm:left-4"
              >
                ‹
              </button>
            )}

            <motion.img
              key={images[index]}
              src={images[index]}
              alt=""
              drag={zoom > 1}
              dragElastic={0.15}
              dragMomentum={false}
              onDoubleClick={toggleZoom}
              animate={{ scale: zoom }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className={`max-h-[75vh] max-w-full touch-none select-none rounded-lg object-contain shadow-2xl ${
                zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
              }`}
              onClick={(event) => {
                event.stopPropagation();
                if (zoom === 1) {
                  toggleZoom();
                }
              }}
            />

            {/* Next arrow */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => onNavigate((index + 1) % images.length)}
                aria-label="Next photo"
                className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-xl text-[var(--cream)] transition hover:bg-white/20 sm:right-4"
              >
                ›
              </button>
            )}
          </div>

          {/* Zoom controls */}
          <div
            className="flex items-center justify-center gap-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={zoomOut}
              disabled={zoom <= MIN_ZOOM}
              aria-label="Zoom out"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-lg text-[var(--cream)] transition hover:bg-white/20 disabled:opacity-30"
            >
              −
            </button>

            <span className="min-w-[3.5rem] text-center text-xs tracking-wide text-[var(--cream)]/70">
              {Math.round(zoom * 100)}%
            </span>

            <button
              type="button"
              onClick={zoomIn}
              disabled={zoom >= MAX_ZOOM}
              aria-label="Zoom in"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-lg text-[var(--cream)] transition hover:bg-white/20 disabled:opacity-30"
            >
              +
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}