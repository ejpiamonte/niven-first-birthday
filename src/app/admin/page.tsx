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

type RsvpRow = {
  timestamp: string;
  name: string;
  attending: boolean;
  attendingLabel: string;
  guestCount: number;
  message: string;
};

type RsvpData = {
  summary: {
    totalResponses: number;
    totalAttending: number;
    totalNotAttending: number;
    totalGuests: number;
  };
  rows: RsvpRow[];
};

const STORAGE_KEY = "azarius-admin-password";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [data, setData] = useState<AdminData | null>(null);
  const [rsvpData, setRsvpData] = useState<RsvpData | null>(null);
  const [error, setError] = useState("");
  const [rsvpError, setRsvpError] = useState("");
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
    setRsvpError("");

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

      const rsvpResponse = await fetch("/api/admin/rsvps", {
        headers: { "x-admin-password": pwd },
      });
      const rsvpBody = await rsvpResponse.json().catch(() => null);

      if (!rsvpResponse.ok) {
        setRsvpError(rsvpBody?.error || "Could not load RSVP spreadsheet data.");
      } else {
        setRsvpData(rsvpBody as RsvpData);
      }
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  async function moderate(id: string, action: "approve" | "reject") {
    setError("");

    try {
      const response = await fetch("/api/admin/moderate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ id, action }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error || "Could not update that message.");
        return;
      }

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
            Enter the admin password to view Google Forms RSVP responses and
            manage guestbook messages.
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
    <main className="min-h-screen bg-[#2B1810] px-4 py-12 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-serif text-3xl text-[#F5EDE0]">Niven&apos;s Birthday — Admin</h1>

        <p className="mt-2 text-sm text-white/50">
          RSVP responses are loaded from the linked Google Forms response sheet.
        </p>

        <section className="mt-10">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-serif text-xl text-[#F5EDE0]">RSVP Responses</h2>
            <button
              onClick={() => void loadData(password)}
              disabled={loading}
              className="rounded-full border border-[#C9973B]/40 px-4 py-2 text-xs uppercase tracking-[0.12em] text-white/70 transition hover:border-[#C9973B] disabled:opacity-50"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {rsvpError && (
            <p className="mt-3 rounded-lg border border-red-300/20 bg-red-300/10 px-4 py-3 text-sm text-red-200">
              {rsvpError}
            </p>
          )}

          {rsvpData && (
            <>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Responses", value: rsvpData.summary.totalResponses },
                  { label: "Attending", value: rsvpData.summary.totalAttending },
                  { label: "Declined", value: rsvpData.summary.totalNotAttending },
                  { label: "Total Guests", value: rsvpData.summary.totalGuests },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-[#C9973B]/20 bg-white/[0.04] p-4 text-center">
                    <p className="font-serif text-2xl text-[#E8C87A]">{item.value}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/50">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 overflow-x-auto rounded-xl border border-[#C9973B]/20">
                <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                  <thead className="bg-white/[0.05] text-[10px] uppercase tracking-[0.12em] text-white/50">
                    <tr>
                      <th className="px-4 py-3">Submitted</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Response</th>
                      <th className="px-4 py-3">Guests</th>
                      <th className="px-4 py-3">Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {rsvpData.rows.map((row, index) => (
                      <tr key={`${row.timestamp}-${row.name}-${index}`} className="align-top">
                        <td className="whitespace-nowrap px-4 py-3 text-white/60">{row.timestamp || "—"}</td>
                        <td className="px-4 py-3 font-medium text-[#E8C87A]">{row.name || "(no name)"}</td>
                        <td className="px-4 py-3">{row.attendingLabel || (row.attending ? "Attending" : "Not attending")}</td>
                        <td className="px-4 py-3">{row.guestCount}</td>
                        <td className="max-w-md whitespace-pre-wrap px-4 py-3 text-white/70">{row.message || "—"}</td>
                      </tr>
                    ))}
                    {rsvpData.rows.length === 0 && (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-white/50">No RSVP responses found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        {error && (
          <p className="mt-6 rounded-lg border border-red-300/20 bg-red-300/10 px-4 py-3 text-sm text-red-200">{error}</p>
        )}

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
