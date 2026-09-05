import { NextRequest, NextResponse } from "next/server";
import getSupabaseAdmin from "@/src/lib/supabase";

// .slice() cuts by UTF-16 code unit, not by character — most emoji are
// two code units, so a plain .slice(0, n) landing exactly mid-emoji
// would leave a broken half-character at the end. Array.from splits by
// Unicode code point instead, so this cuts between whole characters.
function truncate(value: string, maxLength: number): string {
  return Array.from(value).slice(0, maxLength).join("");
}

// Public: list live messages, newest last.
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("guestbook")
      .select("id, name, message, created_at")
      .eq("approved", true)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Supabase guestbook select error:", error);
      return NextResponse.json({ error: "Could not load messages." }, { status: 500 });
    }

    return NextResponse.json({ messages: data ?? [] });
  } catch (error) {
    console.error("Guestbook GET route error:", error);
    return NextResponse.json({ error: "Could not load messages." }, { status: 500 });
  }
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