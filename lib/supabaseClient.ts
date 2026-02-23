import { createClient } from "@supabase/supabase-js";

// ✅ Client-side Supabase instance (safe to use in Client Components)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ✅ Optional helper (same as above)
export function supabaseBrowser() {
  return supabase;
}

// ✅ Server-side Supabase instance (ONLY use in API routes / server code)
export function supabaseServer() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}