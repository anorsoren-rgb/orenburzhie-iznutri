import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// ВНИМАНИЕ: этот клиент обходит RLS.
// Использовать ТОЛЬКО на сервере (API routes, server actions, cron).
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
