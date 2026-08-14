import { NextRequest, NextResponse } from "next/server";
import getSupabaseAdmin from "@/src/lib/supabase";

function isAuthorized(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  const provided = request.headers.get("x-admin-password");
  return Boolean(password) && provided === password;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
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
