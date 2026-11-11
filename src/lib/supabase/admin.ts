import "server-only";
import { createClient } from "@supabase/supabase-js";

// Supabase client with the Secret key (sb_secret_*). Bypasses RLS — use only in
// route handlers, AFTER authenticating the user, and always re-apply the
// per-user filter yourself. Never import this from a Client Component.
export function createAdminClient() {
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error("SUPABASE_SECRET_KEY is not set on the server");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
