import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client.
 *
 * This uses the SERVICE ROLE key, which bypasses Row Level Security.
 * It must never be imported into a "use client" component or exposed
 * to the browser — only import this inside files under `src/app/api/**`
 * (Next.js Route Handlers), which run exclusively on the server.
 *
 * Required environment variables (server-only, no NEXT_PUBLIC_ prefix):
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */
function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export type RsvpRow = {
  id: string;
  name: string;
  attending: boolean;
  guest_count: number;
  message: string | null;
  created_at: string;
};

export type GuestbookRow = {
  id: string;
  name: string;
  message: string;
  edit_token: string;
  approved: boolean;
  created_at: string;
};

export default getSupabaseAdmin;
