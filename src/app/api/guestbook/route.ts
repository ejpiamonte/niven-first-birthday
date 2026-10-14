// src/app/api/guestbook/route.ts
import { NextRequest, NextResponse } from "next/server";
import getSupabaseAdmin from "@/src/lib/supabase";
import { fetchRsvpRows } from "@/src/lib/rsvpSheet";

type GuestbookMessage = {
  id: string;
  name: string;
  message: string;
  sortTime: number;
};

// .slice() cuts by UTF-16 code unit, not by character — most emoji are
// two code units, so a plain .slice(0, n) landing exactly mid-emoji
// would leave a broken half-character at the end. Array.from splits by
// Unicode code point instead, so this cuts between whole characters.
function truncate(value: string, maxLength: number): string {
  return Array.from(value).slice(0, maxLength).join("");
}

// Public: show messages entered in the RSVP Sheet and saved guestbook rows.
// The response intentionally contains only the author and message fields
// (plus an opaque key for rendering); timestamps and RSVP details stay private.
export async function GET() {
  const [sheetResult, databaseResult] = await Promise.allSettled([
    fetchRsvpRows(),
    (async () => {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from("guestbook")
        .select("id, name, message, approved, created_at")
        .eq("approved", true)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data ?? [];
    })(),
  ]);

  const messages: GuestbookMessage[] = [];
  const warnings: string[] = [];

  if (sheetResult.status === "fulfilled") {
    sheetResult.value.forEach((row, index) => {
      if (!row.name || row.name === "(no name)" || !row.message) return;
      messages.push({
        id: `rsvp-${index}-${row.timestamp}`,
        name: row.name,
        message: row.message,
        sortTime: Date.parse(row.timestamp) || 0,
      });
    });
  } else {
    console.error("Guestbook RSVP sheet fetch error:", sheetResult.reason);
    warnings.push("RSVP messages could not be loaded.");
  }

  if (databaseResult.status === "fulfilled") {
    for (const row of databaseResult.value) {
      messages.push({
        id: row.id,
        name: row.name,
        message: row.message,
        sortTime: Date.parse(row.created_at) || 0,
      });
    }
  } else {
    console.error("Supabase guestbook select error:", databaseResult.reason);
    warnings.push("Saved guestbook messages could not be loaded.");
  }

  if (warnings.length === 2) {
    return NextResponse.json(
      { error: "Could not load guestbook messages." },
      { status: 500 }
    );
  }

  messages.sort((a, b) => a.sortTime - b.sortTime);
  return NextResponse.json({
    messages: messages.map(({ id, name, message }) => ({ id, name, message })),
    ...(warnings.length > 0 ? { warning: warnings.join(" ") } : {}),
  });
}

// Create a new guestbook entry. Goes live immediately — no moderation
// queue. The admin dashboard keeps the ability to remove a message
// after the fact as a safety net (see app/api/admin/moderate).
export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, message } = body as { name?: string; message?: string };

  if (!name || !name.trim() || !message || !message.trim()) {
    return NextResponse.json(
      { error: "Name and message are required." },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("guestbook")
      .insert({
        name: truncate(name.trim(), 80),
        message: truncate(message.trim(), 500),
        approved: true,
      })
      .select("id, edit_token")
      .single();

    if (error || !data) {
      console.error("Supabase guestbook insert error:", error);
      return NextResponse.json(
        { error: "Something went wrong saving your message." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { id: data.id, editToken: data.edit_token },
      { status: 201 }
    );
  } catch (error) {
    console.error("Guestbook POST route error:", error);
    return NextResponse.json(
      { error: "Something went wrong saving your message." },
      { status: 500 }
    );
  }
}

// Edit an existing entry. Requires the private edit token issued at
// creation (stored client-side in localStorage — see Guestbook.tsx).
// Editing keeps the message live; it does not send it back into review.
export async function PATCH(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { id, editToken, name, message } = body as {
    id?: string;
    editToken?: string;
    name?: string;
    message?: string;
  };

  if (!id || !editToken || !name?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();

    const { data: existing, error: fetchError } = await supabase
      .from("guestbook")
      .select("id, edit_token")
      .eq("id", id)
      .single();

    if (fetchError || !existing || existing.edit_token !== editToken) {
      return NextResponse.json(
        { error: "We couldn't verify you own this message." },
        { status: 403 }
      );
    }

    const { error: updateError } = await supabase
      .from("guestbook")
      .update({
        name: truncate(name.trim(), 80),
        message: truncate(message.trim(), 500),
      })
      .eq("id", id);

    if (updateError) {
      console.error("Supabase guestbook update error:", updateError);
      return NextResponse.json(
        { error: "Something went wrong updating your message." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Guestbook PATCH route error:", error);
    return NextResponse.json(
      { error: "Something went wrong updating your message." },
      { status: 500 }
    );
  }
}
