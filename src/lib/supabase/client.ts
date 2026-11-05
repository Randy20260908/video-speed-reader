import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client. Stores the session in cookies (not localStorage)
// so server components, route handlers and middleware can read it too.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
