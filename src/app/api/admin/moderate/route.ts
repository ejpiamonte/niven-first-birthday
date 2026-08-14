import { NextRequest, NextResponse } from "next/server";
import getSupabaseAdmin from "@/src/lib/supabase";

function isAuthorized(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  const provided = request.headers.get("x-admin-password");
  return Boolean(password) && provided === password;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { id, action } = body as { id?: string; action?: "approve" | "reject" };

  if (!id || (action !== "approve" && action !== "reject")) {
    return NextResponse.json({ error: "Missing id or action." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();

    if (action === "approve") {
      const { error } = await supabase
        .from("guestbook")
        .update({ approved: true })
        .eq("id", id);

      if (error) {
        console.error("Supabase approve error:", error);
        return NextResponse.json({ error: "Could not approve message." }, { status: 500 });
      }
    } else {
      const { error } = await supabase.from("guestbook").delete().eq("id", id);

      if (error) {
        console.error("Supabase reject error:", error);
        return NextResponse.json({ error: "Could not reject message." }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Moderate route error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
