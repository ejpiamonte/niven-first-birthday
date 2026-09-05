// src/app/api/admin/route.ts
import { NextRequest, NextResponse } from "next/server";
import getSupabaseAdmin from "@/src/lib/supabase";

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

export async function GET(request: NextRequest) {
  const auth = checkAuth(request);

  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const supabase = getSupabaseAdmin();

    const { data: guestbook, error } = await supabase
      .from("guestbook")
      .select("id, name, message, approved, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase admin fetch error:", error);
      return NextResponse.json({ error: "Could not load admin data." }, { status: 500 });
    }

    return NextResponse.json({ guestbook: guestbook ?? [] });
  } catch (error) {
    console.error("Admin route error:", error);
    return NextResponse.json({ error: "Could not load admin data." }, { status: 500 });
  }
}
