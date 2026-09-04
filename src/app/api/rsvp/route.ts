import { NextRequest, NextResponse } from "next/server";
import getSupabaseAdmin from "@/src/lib/supabase";

// Public: aggregate attendance numbers for the "who's coming" counter.
// Only ever returns counts — never individual names or messages.
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("rsvp")
      .select("guest_count")
      .eq("attending", true);

    if (error) {
      console.error("Supabase rsvp select error:", error);
      return NextResponse.json(
        { error: "Could not load RSVP count." },
        { status: 500 }
      );
    }

    const responses = data?.length ?? 0;
    const guests = (data ?? []).reduce(
      (sum, row) => sum + (row.guest_count ?? 1),
      0
    );

    return NextResponse.json({ responses, guests });
  } catch (error) {
    console.error("RSVP GET route error:", error);
    return NextResponse.json(
      { error: "Could not load RSVP count." },
      { status: 500 }
    );
  }
}

// Records an RSVP in Supabase purely so we have a queryable attendance
// count. This runs ALONGSIDE the existing Google Form submission in
// RSVP.tsx, not instead of it — the Form stays what you actually
// review; this table only feeds the on-page counter.
export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, attending, guestCount, message } = body as {
    name?: string;
    attending?: boolean;
    guestCount?: number;
    message?: string;
  };

  if (!name?.trim() || typeof attending !== "boolean") {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();

    const { error } = await supabase.from("rsvp").insert({
      name: name.trim().slice(0, 80),
      attending,
      guest_count: attending ? Math.max(1, Math.min(10, guestCount ?? 1)) : 0,
      message: message?.trim().slice(0, 500) || null,
    });

    if (error) {
      console.error("Supabase rsvp insert error:", error);
      return NextResponse.json({ error: "Could not save RSVP." }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("RSVP POST route error:", error);
    return NextResponse.json({ error: "Could not save RSVP." }, { status: 500 });
  }
}