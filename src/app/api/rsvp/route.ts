import { NextResponse } from "next/server";
import { fetchRsvpRows, summarizeRsvpRows } from "@/src/lib/rsvpSheet";

// Public: aggregate attendance numbers for the "who's coming" counter,
// read directly from the same Google Sheet the admin dashboard uses.
// This is now the single source of truth — there's no separate
// Supabase table for this anymore, so there's nothing left that can
// drift out of sync with the Sheet.
//
// Only ever returns counts — never individual names or messages.
export async function GET() {
  try {
    const rows = await fetchRsvpRows();
    const summary = summarizeRsvpRows(rows);

    return NextResponse.json({
      responses: summary.totalAttending,
      guests: summary.totalGuests,
    });
  } catch (error) {
    console.error("RSVP GET route error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not load RSVP count.",
      },
      { status: 500 }
    );
  }
}