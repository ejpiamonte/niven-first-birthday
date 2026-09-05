import { ATTENDING_YES_LABEL } from "@/src/lib/googleForm";

// Shared by both api/rsvp (public attendee counter) and
// api/admin/rsvps (password-protected dashboard) so the Google Sheet
// CSV parsing only lives in one place. Previously this was copy-pasted
// into two files, which is how the two routes ended up with identical
// content and one accidentally overwrote the other.

export type RsvpSheetRow = {
  timestamp: string;
  name: string;
  attending: boolean;
  attendingLabel: string;
  guestCount: number;
  message: string;
};

export type RsvpSummary = {
  totalResponses: number;
  totalAttending: number;
  totalNotAttending: number;
  totalGuests: number;
};

/**
 * Minimal RFC4180-ish CSV parser — handles quoted fields, embedded commas,
 * embedded newlines, and escaped ("") quotes, which is enough for what
 * Google Sheets exports. Avoids pulling in a CSV library for this.
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

/**
 * Fetches and parses the published Google Sheet CSV. Throws on any
 * failure (missing env var, non-OK fetch) — callers should catch and
 * turn that into whatever HTTP response fits their route.
 */
export async function fetchRsvpRows(): Promise<RsvpSheetRow[]> {
  const csvUrl = process.env.GOOGLE_SHEET_CSV_URL;

  if (!csvUrl) {
    throw new Error(
      "GOOGLE_SHEET_CSV_URL is not set on the server. See SETUP.md for how to publish your Google Sheet as CSV and add the URL to .env.local."
    );
  }

  const response = await fetch(csvUrl, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(
      `Could not fetch the response sheet (status ${response.status}).`
    );
  }

  const csvText = await response.text();
  const table = parseCsv(csvText);

  if (table.length === 0) {
    return [];
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

  const rows: RsvpSheetRow[] = dataRows.map((cells) => {
    const attendingLabel =
      attendingIdx >= 0 ? (cells[attendingIdx] ?? "").trim() : "";

    return {
      timestamp: timestampIdx >= 0 ? (cells[timestampIdx] ?? "").trim() : "",
      name: nameIdx >= 0 ? (cells[nameIdx] ?? "").trim() : "(no name)",
      attending: attendingLabel === ATTENDING_YES_LABEL,
      attendingLabel,
      guestCount:
        guestsIdx >= 0 ? parseInt(cells[guestsIdx] ?? "0", 10) || 0 : 0,
      message: messageIdx >= 0 ? (cells[messageIdx] ?? "").trim() : "",
    };
  });

  // Newest first — Sheets appends new responses at the bottom.
  rows.reverse();

  return rows;
}

export function summarizeRsvpRows(rows: RsvpSheetRow[]): RsvpSummary {
  const attendingRows = rows.filter((r) => r.attending);

  return {
    totalResponses: rows.length,
    totalAttending: attendingRows.length,
    totalNotAttending: rows.length - attendingRows.length,
    totalGuests: attendingRows.reduce((sum, r) => sum + r.guestCount, 0),
  };
}