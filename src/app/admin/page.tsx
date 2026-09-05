"use client";

import { useEffect, useState } from "react";

type GuestbookRow = {
  id: string;
  name: string;
  message: string;
  approved: boolean;
  created_at: string;
};

type AdminData = {
  guestbook: GuestbookRow[];
};

const STORAGE_KEY = "azarius-admin-password";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = window.sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      // Deferred to a microtask so this isn't a synchronous setState call
      // in the effect body — see Countdown.tsx for the same pattern.
      queueMicrotask(() => setPassword(saved));
      void loadData(saved);
    }
  }, []);

  async function loadData(pwd: string) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin", {
        headers: { "x-admin-password": pwd },
      });

      if (!response.ok) {
        setAuthorized(false);
        const body = await response.json().catch(() => null);
        setError(body?.error || "Incorrect password.");
        window.sessionStorage.removeItem(STORAGE_KEY);
        return;
      }

      const json = (await response.json()) as AdminData;
      setData(json);
      setAuthorized(true);
      window.sessionStorage.setItem(STORAGE_KEY, pwd);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  async function moderate(id: string, action: "approve" | "reject") {
    try {
      await fetch("/api/admin/moderate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ id, action }),
      });

      void loadData(password);
    } catch {
      setError("Could not update that message.");
    }
  }

  if (!authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#2B1810] px-6">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void loadData(password);
          }}
          className="w-full max-w-sm rounded-2xl border border-[#C9973B]/30 bg-white/[0.04] p-8"
        >
          <h1 className="font-serif text-2xl text-[#F5EDE0]">Admin</h1>

          <p className="mt-2 text-sm text-white/60">
            Enter the admin password to moderate the guestbook. RSVP totals
            live in your Google Form&apos;s Responses tab.
          </p>

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="mt-6 w-full rounded-xl border border-[#C9973B]/40 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#C9973B]"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-full bg-[#C9973B] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#2B1810] transition hover:bg-[#E8C87A] disabled:opacity-50"
          >
            {loading ? "Checking..." : "Enter"}
          </button>

          {error && <p className="mt-4 text-center text-xs text-red-300">{error}</p>}
        </form>
      </main>
    );
  }

  const pending = data?.guestbook.filter((row) => !row.approved) ?? [];
  const approved = data?.guestbook.filter((row) => row.approved) ?? [];

  return (
    <main className="min-h-screen bg-[#2B1810] px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-3xl text-[#F5EDE0]">Niven&apos;s Birthday — Admin</h1>

        <p className="mt-2 text-sm text-white/50">
          Looking for RSVP totals? Open your Google Form&apos;s Responses tab
          — it has a live Yes/No breakdown and the full guest list.
        </p>

        {data && (
          <>
            <h2 className="mt-10 font-serif text-xl text-[#F5EDE0]">
              Pending Guestbook Messages ({pending.length})
            </h2>

            <div className="mt-4 space-y-3">
              {pending.length === 0 && (
                <p className="text-sm text-white/50">Nothing waiting for review.</p>
              )}

              {pending.map((row) => (
                <div
                  key={row.id}
                  className="rounded-lg border border-[#C9973B]/30 bg-white/[0.03] px-4 py-3 text-sm"
                >
                  <p className="font-medium text-[#E8C87A]">{row.name}</p>
                  <p className="mt-1 text-white/70">{row.message}</p>

                  <div className="mt-3 flex gap-3">
                    <button
                      onClick={() => void moderate(row.id, "approve")}
                      className="rounded-full bg-[#D98C4A] px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#2B1810]"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => void moderate(row.id, "reject")}
                      className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/70"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="mt-12 font-serif text-xl text-[#F5EDE0]">
              Published Guestbook Messages ({approved.length})
            </h2>

            <div className="mt-4 space-y-2">
              {approved.map((row) => (
                <div
                  key={row.id}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm"
                >
                  <p className="font-medium text-white">{row.name}</p>
                  <p className="mt-1 text-white/60">{row.message}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
