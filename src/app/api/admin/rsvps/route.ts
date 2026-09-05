import { NextRequest, NextResponse } from "next/server";
import { fetchRsvpRows, summarizeRsvpRows } from "@/src/lib/rsvpSheet";

function checkAuth(
  request: NextRequest
): { ok: true } | { ok: false; error: string; status: number } {
  const password = process.env.ADMIN_PASSWORD;
  const provided = request.headers.get("x-admin-password");

  if (!password) {
    return {
      ok: false,
      status: 500,
      error:
        "ADMIN_PASSWORD is not set on the server. Add it to .env.local and restart `npm run dev` (or redeploy, if this is on Vercel).",
    };
  }

  if (provided !== password) {
    return { ok: false, status: 401, error: "Incorrect password." };
  }

  return { ok: true };
}

export async function GET(request: NextRequest) {
  const auth = checkAuth(request);

  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const rows = await fetchRsvpRows();
    const summary = summarizeRsvpRows(rows);

    return NextResponse.json({ summary, rows });
  } catch (error) {
    console.error("RSVP dashboard fetch error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong loading responses.",
      },
      { status: 500 }
    );
  }
}