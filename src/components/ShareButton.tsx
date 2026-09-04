"use client";

import { useState } from "react";

const SITE_URL = "https://niven-first-birthday.vercel.app/";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function shareInvitation() {
    const shareData = {
      title: "Azarius's 1st Birthday",
      text: "You're invited to celebrate Azarius Niven's first birthday! 🎂",
      url: SITE_URL,
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
      await navigator.clipboard.writeText(SITE_URL);

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
      className="w-full rounded-full bg-[var(--gold)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--coffee)] transition hover:bg-[var(--dust)]"
    >
      {copied ? "✓ Link Copied!" : "📤 Share Invitation"}
    </button>
  );
}