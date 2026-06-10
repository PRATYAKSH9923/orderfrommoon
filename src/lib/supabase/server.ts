import "server-only";

// ============================================================================
//  Server Supabase client.
//   - getSupabaseServerClient(): anon key, for public reads in Server Components.
//   - getSupabaseAdminClient(): service_role key, bypasses RLS. Use ONLY in
//     trusted server code (admin order-status updates). Never import on client.
// ============================================================================

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { publicEnv, serverEnv } from "@/lib/env";

export function getSupabaseServerClient(): SupabaseClient {
  return createClient(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey, {
    auth: { persistSession: false },
  });
}

export function getSupabaseAdminClient(): SupabaseClient {
  const env = serverEnv();
  return createClient(env.supabaseUrl, env.serviceRoleKey, {
    auth: { persistSession: false },
  });
}
