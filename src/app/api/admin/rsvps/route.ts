// src/app/api/admin/rsvps/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ATTENDING_YES_LABEL } from "@/src/lib/googleForm";

function checkAuth(request: NextRequest): { ok: true } | { ok: false; error: string; status: number } {
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

/**
 * Minimal RFC4180-ish CSV parser — handles quoted fields, embedded commas,
 * embedded newlines, and escaped ("") quotes, which is enough for what
 * Google Sheets exports. Avoids pulling in a CSV library for one endpoint.
 */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char === "\r") {
      // skip — \r\n line endings are handled by the \n branch above
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

type RsvpRow = {
  timestamp: string;
  name: string;
  attending: boolean;
  attendingLabel: string;
  guestCount: number;
  message: string;
};

export async function GET(request: NextRequest) {
  const auth = checkAuth(request);

  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const csvUrl = process.env.GOOGLE_SHEET_CSV_URL;

  if (!csvUrl) {
    return NextResponse.json(
      {
        error:
          "GOOGLE_SHEET_CSV_URL is not set on the server. See SETUP.md for how to publish your Google Sheet as CSV and add the URL to .env.local.",
      },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(csvUrl, { cache: "no-store" });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Could not fetch the response sheet (status ${response.status}).` },
        { status: 502 }
      );
    }

    const csvText = await response.text();
    const table = parseCsv(csvText);

    if (table.length === 0) {
      return NextResponse.json({
        summary: { totalResponses: 0, totalAttending: 0, totalNotAttending: 0, totalGuests: 0 },
        rows: [],
      });
    }

    const header = table[0].map((h) => h.trim().toLowerCase());
    const dataRows = table.slice(1);

    // Match columns by header text rather than fixed position, so this
    // keeps working even if the Form's question order ever changes.
    const timestampIdx = header.findIndex((h) => h.includes("timestamp"));
    const nameIdx = header.findIndex((h) => h.includes("name"));
    const attendingIdx = header.findIndex((h) => h.includes("joining"));
    const guestsIdx = header.findIndex((h) => h.includes("guest"));
    const messageIdx = header.findIndex((h) => h.includes("message"));

    const rows: RsvpRow[] = dataRows.map((cells) => {
      const attendingLabel = attendingIdx >= 0 ? (cells[attendingIdx] ?? "").trim() : "";

      return {
        timestamp: timestampIdx >= 0 ? (cells[timestampIdx] ?? "").trim() : "",
        name: nameIdx >= 0 ? (cells[nameIdx] ?? "").trim() : "(no name)",
        attending: attendingLabel === ATTENDING_YES_LABEL,
        attendingLabel,
        guestCount: guestsIdx >= 0 ? parseInt(cells[guestsIdx] ?? "0", 10) || 0 : 0,
        message: messageIdx >= 0 ? (cells[messageIdx] ?? "").trim() : "",
      };
    });

    // Newest first — Sheets appends new responses at the bottom.
    rows.reverse();

    const attendingRows = rows.filter((r) => r.attending);

    const summary = {
      totalResponses: rows.length,
      totalAttending: attendingRows.length,
      totalNotAttending: rows.length - attendingRows.length,
      totalGuests: attendingRows.reduce((sum, r) => sum + r.guestCount, 0),
    };

    return NextResponse.json({ summary, rows });
  } catch (error) {
    console.error("RSVP dashboard fetch error:", error);
    return NextResponse.json(
      { error: "Something went wrong loading responses." },
      { status: 500 }
    );
  }
}