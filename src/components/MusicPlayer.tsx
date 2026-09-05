// src/components/MusicPlayer.tsx
"use client";

type MusicPlayerProps = {
  playing: boolean;
  onToggle: () => void;
};

// Purely presentational now — the actual <audio> element and playback
// logic live in Invitation.tsx, so opening the envelope (a real user
// gesture) can start the same track this button controls. See
// Invitation.tsx for why: browsers block audio autoplay on page load,
// but allow it inside a user-gesture handler like a click.
export default function MusicPlayer({ playing, onToggle }: MusicPlayerProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={playing ? "Pause music" : "Play music"}
      className="music-orbit fixed right-5 top-5 z-50 flex h-11 w-11 items-center justify-center rounded-full text-lg"
    >
      {playing ? "♫" : "🔇"}
    </button>
  );
}