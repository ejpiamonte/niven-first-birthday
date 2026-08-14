"use client";

import { useEffect, useState } from "react";

type GuestMessage = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

type MyEntry = {
  id: string;
  editToken: string;
  name: string;
  message: string;
};

const STORAGE_KEY = "azarius-guestbook-entry";

export default function Guestbook() {
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  const [myEntry, setMyEntry] = useState<MyEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    void loadMessages();

    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as MyEntry;

        // Deferred to a microtask so these aren't synchronous setState
        // calls in the effect body — see Countdown.tsx for the same pattern.
        queueMicrotask(() => {
          setMyEntry(parsed);
          setName(parsed.name);
          setMessage(parsed.message);
        });
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  async function loadMessages() {
    setLoadingMessages(true);

    try {
      const response = await fetch("/api/guestbook");
      const data = await response.json();
      setMessages(data.messages ?? []);
    } catch {
      // Silently fail — the form below still works.
    } finally {
      setLoadingMessages(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!name.trim() || !message.trim()) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      if (myEntry) {
        const response = await fetch("/api/guestbook", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: myEntry.id,
            editToken: myEntry.editToken,
            name: name.trim(),
            message: message.trim(),
          }),
        });

        if (!response.ok) {
          const body = await response.json().catch(() => null);
          setError(body?.error || "Something went wrong. Please try again.");
          return;
        }

        const updated: MyEntry = {
          ...myEntry,
          name: name.trim(),
          message: message.trim(),
        };
        setMyEntry(updated);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } else {
        const response = await fetch("/api/guestbook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), message: message.trim() }),
        });

        if (!response.ok) {
          const body = await response.json().catch(() => null);
          setError(body?.error || "Something went wrong. Please try again.");
          return;
        }

        const data = await response.json();
        const created: MyEntry = {
          id: data.id,
          editToken: data.editToken,
          name: name.trim(),
          message: message.trim(),
        };
        setMyEntry(created);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(created));
      }

      setIsEditing(false);
      setJustSaved(true);
      void loadMessages();

      setTimeout(() => setJustSaved(false), 4000);
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const showForm = !myEntry || isEditing;

  return (
    <section className="bg-[#071A3D] px-6 py-20 text-white">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#D8B76A]">
            Leave Some Love
          </p>

          <h2 className="mt-4 font-serif text-4xl text-[#FAF7F0]">
            Guestbook
          </h2>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-white/60">
            Leave a birthday message that Azarius and our family can look
            back on for years to come.
          </p>
        </div>

        {/* Messages */}
        <div className="mt-10 space-y-4">
          {loadingMessages && (
            <p className="text-center text-xs uppercase tracking-[0.2em] text-white/30">
              Loading messages...
            </p>
          )}

          {!loadingMessages && messages.length === 0 && (
            <p className="text-center text-sm text-white/40">
              Be the first to leave a birthday message!
            </p>
          )}

          {messages.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-[#D8B76A]/20 bg-white/[0.04] p-5"
            >
              <div className="text-[#D8B76A]">&ldquo;</div>

              <p className="mt-1 text-sm leading-7 text-white/80">
                {item.message}
              </p>

              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[#F0D99A]">
                — {item.name}
              </p>
            </div>
          ))}
        </div>

        {/* My entry status */}
        {myEntry && !showForm && (
          <div className="mt-10 rounded-2xl border border-[#8FD9B6]/30 bg-[#8FD9B6]/10 p-5 text-center">
            <p className="text-sm text-white/80">
              You&apos;ve already left a message. It&apos;ll appear above once
              it&apos;s reviewed.
            </p>

            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 text-xs uppercase tracking-[0.2em] text-[#F0D99A] underline underline-offset-4"
            >
              Edit your message
            </button>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mt-10 space-y-4">
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border border-[#D8B76A]/30 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#D8B76A]"
              required
            />

            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Write a birthday message..."
              rows={4}
              className="w-full resize-none rounded-xl border border-[#D8B76A]/30 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#D8B76A]"
              required
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-[#D8B76A] px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#071A3D] transition hover:bg-[#F0D99A] disabled:opacity-50"
            >
              {submitting
                ? "Saving..."
                : myEntry
                ? "Save Changes"
                : "Send Birthday Message"}
            </button>

            {myEntry && isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-full text-center text-xs uppercase tracking-[0.2em] text-white/40"
              >
                Cancel
              </button>
            )}

            {error && (
              <p className="text-center text-xs text-red-300">{error}</p>
            )}
          </form>
        )}

        {justSaved && (
          <p className="mt-4 text-center text-xs text-[#F0D99A]">
            Your message has been saved and is awaiting review. ❤️
          </p>
        )}
      </div>
    </section>
  );
}
