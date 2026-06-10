"use client";

// ============================================================================
//  Browser Supabase client (anon key). Safe to use in Client Components.
//  Realtime subscriptions and public reads/inserts go through this.
// ============================================================================

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { publicEnv } from "@/lib/env";

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;

  if (!publicEnv.supabaseUrl || !publicEnv.supabaseAnonKey) {
    throw new Error(
      "Supabase env vars are not set. Fill NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (see SUPABASE_SETUP.md)."
    );
  }

  browserClient = createClient(
    publicEnv.supabaseUrl,
    publicEnv.supabaseAnonKey,
    {
      auth: { persistSession: false },
      realtime: { params: { eventsPerSecond: 5 } },
    }
  );
  return browserClient;
}
