"use client";

import { useState } from "react";
import {
  ATTENDING_NO_LABEL,
  ATTENDING_YES_LABEL,
  submitRsvpToGoogleForm,
} from "@/src/lib/googleForm";

export default function RSVP() {
  const [attending, setAttending] = useState<boolean | null>(null);
  const [name, setName] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!name.trim() || attending === null) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await submitRsvpToGoogleForm({
        name: name.trim(),
        attending,
        guestCount,
        message: message.trim(),
      });

      // Best-effort: also record this in Supabase so the on-page
      // attendee counter (shown above the Guestbook) can reflect it.
      // If this fails, don't block the confirmation — the Google Form
      // submission above is the one that actually matters; this just
      // feeds the counter.
      try {
        await fetch("/api/rsvp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            attending,
            guestCount,
            message: message.trim(),
          }),
        });
      } catch {
        // Silent — the counter just won't include this response yet.
      }

      setSubmitted(true);
    } catch (submitError) {
      console.error(submitError);
      setError(
        "Something went wrong sending your RSVP. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <section className="story-paper px-6 py-20 text-[var(--ink)]">
        <div className="mx-auto max-w-md text-center">
          <div className="text-3xl text-[var(--gold)]">✦</div>

          <h2 className="mt-4 font-serif text-4xl text-[var(--navy)]">
            Thank You
          </h2>

          <p className="mt-5 text-sm leading-7 text-[var(--muted)]">
            Thank you for letting us know. We&apos;re looking forward to
            celebrating Azarius&apos;s special day with you!
          </p>

          <button
            onClick={() => {
              setSubmitted(false);
              setName("");
              setAttending(null);
              setGuestCount(1);
              setMessage("");
            }}
            className="mt-8 text-xs uppercase tracking-[0.2em] text-[var(--brown)] underline underline-offset-4"
          >
            Submit another response
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="story-paper px-6 py-20 text-[var(--ink)]">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--brown)]">
            We Hope You Can Join Us
          </p>

          <h2 className="mt-4 font-serif text-4xl text-[var(--navy)]">
            RSVP
          </h2>

          <div className="gold-rule my-8" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Attendance */}
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-[var(--brown)]">
              Will you be joining us?
            </label>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAttending(true)}
                className={`rounded-full border px-4 py-3 text-sm transition ${
                  attending === true
                    ? "border-[var(--gold)] bg-[var(--coffee)] text-white"
                    : "border-[var(--gold)]/50 bg-white text-[var(--coffee)]"
                }`}
              >
                {ATTENDING_YES_LABEL}
              </button>

              <button
                type="button"
                onClick={() => setAttending(false)}
                className={`rounded-full border px-4 py-3 text-sm transition ${
                  attending === false
                    ? "border-[var(--gold)] bg-[var(--coffee)] text-white"
                    : "border-[var(--gold)]/50 bg-white text-[var(--coffee)]"
                }`}
              >
                {ATTENDING_NO_LABEL}
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label
              htmlFor="rsvp-name"
              className="text-xs uppercase tracking-[0.2em] text-[var(--brown)]"
            >
              Your Name
            </label>

            <input
              id="rsvp-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your name"
              className="mt-3 w-full rounded-xl border border-[var(--gold)]/40 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--gold)]"
              required
            />
          </div>

          {/* Guest count */}
          {attending !== false && (
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-[var(--brown)]">
                Number of Guests
              </label>

              <div className="mt-3 flex items-center justify-center gap-8 rounded-xl border border-[var(--gold)]/40 bg-white py-3">
                <button
                  type="button"
                  onClick={() =>
                    setGuestCount(Math.max(1, guestCount - 1))
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--coffee)] text-lg text-white"
                >
                  −
                </button>

                <span className="min-w-8 text-center font-serif text-2xl text-[var(--coffee)]">
                  {guestCount}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setGuestCount(Math.min(10, guestCount + 1))
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--coffee)] text-lg text-white"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Message */}
          <div>
            <label
              htmlFor="rsvp-message"
              className="text-xs uppercase tracking-[0.2em] text-[var(--brown)]"
            >
              Message
            </label>

            <textarea
              id="rsvp-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Leave a message for Azarius..."
              rows={4}
              className="mt-3 w-full resize-none rounded-xl border border-[var(--gold)]/40 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--gold)]"
            />
          </div>

          <button
            type="submit"
            disabled={attending === null || submitting}
            className="w-full rounded-full bg-[var(--coffee)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--dust)] transition hover:bg-[var(--wood)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "Sending..." : "Confirm RSVP"}
          </button>

          {error && (
            <p className="text-center text-xs text-red-500">{error}</p>
          )}
        </form>
      </div>
    </section>
  );
}