"use client";

import { useEffect, useRef, useState } from "react";

// Drop a royalty-free MP3 at /public/music/birthday.mp3 (see SETUP.md for
// suggested sources). This player never autoplays — playback only starts
// when the guest taps the button, which keeps it compliant with browser
// autoplay policies and considerate of anyone opening this on speaker.
export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio("/music/birthday.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.35;

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  async function toggleMusic() {
    if (!audioRef.current) {
      return;
    }

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }

    try {
      await audioRef.current.play();
      setPlaying(true);
    } catch {
      console.log("Music playback was blocked.");
    }
  }

  return (
    <button
      onClick={toggleMusic}
      aria-label={playing ? "Pause music" : "Play music"}
      className="fixed right-5 top-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-[#D8B76A]/50 bg-[#071A3D]/90 text-lg text-[#F0D99A] shadow-xl backdrop-blur"
    >
      {playing ? "♫" : "🔇"}
    </button>
  );
}