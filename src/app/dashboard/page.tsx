"use client";

import { useEffect, useState } from "react";

type RsvpRow = {
  timestamp: string;
  name: string;
  attending: boolean;
  attendingLabel: string;
  guestCount: number;
  message: string;
};

type DashboardData = {
  summary: {
    totalResponses: number;
    totalAttending: number;
    totalNotAttending: number;
    totalGuests: number;
  };
  rows: RsvpRow[];
};

type Filter = "all" | "attending" | "declined";

// Shared with /admin on purpose — one password unlocks both, since this is
// a personal project rather than a multi-user system.
const STORAGE_KEY = "azarius-admin-password";

export default function DashboardPage() {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    const saved = window.sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      setPassword(saved);
      void loadData(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData(pwd: string) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/rsvps", {
        headers: { "x-admin-password": pwd },
      });

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        setAuthorized(false);
        setError(body?.error || "Incorrect password.");
        window.sessionStorage.removeItem(STORAGE_KEY);
        return;
      }

      setData(body as DashboardData);
      setAuthorized(true);
      window.sessionStorage.setItem(STORAGE_KEY, pwd);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  if (!authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--coffee)] px-6">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void loadData(password);
          }}
          className="story-card w-full max-w-sm rounded-2xl p-8"
        >
          <h1 className="font-serif text-2xl text-[var(--navy)]">
            RSVP Dashboard
          </h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Enter the admin password to see who&apos;s responded.
          </p>

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="story-input mt-6"
          />

          <button
            type="submit"
            disabled={loading}
            className="story-button story-button-gold mt-4 w-full disabled:opacity-50"
          >
            {loading ? "Checking..." : "Enter"}
          </button>

          {error && (
            <p className="mt-4 text-center text-xs text-[var(--rust)]">
              {error}
            </p>
          )}
        </form>
      </main>
    );
  }

  const rows = data?.rows ?? [];
  const filteredRows = rows.filter((row) => {
    if (filter === "attending") return row.attending;
    if (filter === "declined") return !row.attending;
    return true;
  });

  return (
    <main className="min-h-screen bg-[var(--coffee)] px-4 py-12 text-[var(--cream)] sm:px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">
          Azarius&apos;s 1st Birthday
        </p>
        <h1 className="mt-2 font-serif text-3xl text-[var(--cream)]">
          RSVP Dashboard
        </h1>
        <p className="mt-2 text-sm text-[var(--cream)]/50">
          Pulled live from your Google Form&apos;s response sheet.
        </p>

        {data && (
          <>
            {/* Summary cards */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Responses", value: data.summary.totalResponses },
                { label: "Attending", value: data.summary.totalAttending },
                { label: "Not Attending", value: data.summary.totalNotAttending },
                { label: "Total Guests", value: data.summary.totalGuests },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="story-card rounded-xl px-3 py-4 text-center"
                >
                  <p className="font-serif text-3xl text-[var(--navy)]">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-[var(--brown)]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Filter tabs */}
            <div className="mt-8 flex gap-2">
              {(
                [
                  { key: "all", label: `All (${rows.length})` },
                  {
                    key: "attending",
                    label: `Attending (${data.summary.totalAttending})`,
                  },
                  {
                    key: "declined",
                    label: `Declined (${data.summary.totalNotAttending})`,
                  },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition ${
                    filter === tab.key
                      ? "bg-[var(--gold)] text-[var(--navy)]"
                      : "border border-[var(--gold)]/40 text-[var(--cream)]/70 hover:border-[var(--gold)]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              <button
                onClick={() => void loadData(password)}
                className="ml-auto rounded-full border border-[var(--gold)]/40 px-4 py-2 text-xs uppercase tracking-[0.1em] text-[var(--cream)]/70 transition hover:border-[var(--gold)]"
              >
                {loading ? "..." : "↻ Refresh"}
              </button>
            </div>

            {/* Response list */}
            <div className="mt-6 space-y-3">
              {filteredRows.length === 0 && (
                <p className="py-10 text-center text-sm text-[var(--cream)]/40">
                  No responses in this view yet.
                </p>
              )}

              {filteredRows.map((row, i) => (
                <div
                  key={`${row.name}-${row.timestamp}-${i}`}
                  className="story-card rounded-xl p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-serif text-lg text-[var(--navy)]">
                      {row.name || "(no name)"}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${
                        row.attending
                          ? "bg-[var(--sage)]/20 text-[var(--sage)]"
                          : "bg-[var(--rust)]/15 text-[var(--rust)]"
                      }`}
                    >
                      {row.attending
                        ? `Attending · ${row.guestCount} guest${row.guestCount === 1 ? "" : "s"}`
                        : "Not attending"}
                    </span>
                  </div>

                  {row.message && (
                    <p className="mt-2 text-sm leading-6 text-[var(--ink)]/80">
                      &ldquo;{row.message}&rdquo;
                    </p>
                  )}

                  {row.timestamp && (
                    <p className="mt-2 text-[10px] uppercase tracking-[0.1em] text-[var(--muted)]">
                      {row.timestamp}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}