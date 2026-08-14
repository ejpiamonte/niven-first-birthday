"use client";

import { useState } from "react";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function shareInvitation() {
    const shareData = {
      title: "Azarius's 1st Birthday",
      text: "You're invited to celebrate Azarius Zayne's first birthday! 🎂",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled the share sheet.
      }

      return;
    }

    try {
      await navigator.clipboard.writeText(window.location.href);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch {
      console.log("Unable to copy invitation link.");
    }
  }

  return (
    <button
      onClick={shareInvitation}
      className="w-full rounded-full bg-[#D8B76A] px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#071A3D] transition hover:bg-[#F0D99A]"
    >
      {copied ? "✓ Link Copied!" : "📤 Share Invitation"}
    </button>
  );
}