// ============================================================================
//  Centralised env access with helpful errors.
//  NEXT_PUBLIC_* values are inlined into the client bundle by Next.js.
// ============================================================================

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing environment variable: ${name}. See SUPABASE_SETUP.md / .env.example.`
    );
  }
  return value;
}

/** Public (browser-safe) config. */
export const publicEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  restaurantName:
    process.env.NEXT_PUBLIC_RESTAURANT_NAME ?? "The Belgian Waffle Xpress",
  restaurantWhatsApp: process.env.NEXT_PUBLIC_RESTAURANT_WHATSAPP ?? "",
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR ?? "#d97706",
  secondaryColor: process.env.NEXT_PUBLIC_SECONDARY_COLOR ?? "#5b3a1a",
};

/** Server-only config — accessing these on the client will throw. */
export function serverEnv() {
  return {
    supabaseUrl: required(
      "NEXT_PUBLIC_SUPABASE_URL",
      process.env.NEXT_PUBLIC_SUPABASE_URL
    ),
    serviceRoleKey: required(
      "SUPABASE_SERVICE_ROLE_KEY",
      process.env.SUPABASE_SERVICE_ROLE_KEY
    ),
    adminUsername: required("ADMIN_USERNAME", process.env.ADMIN_USERNAME),
    adminPassword: required("ADMIN_PASSWORD", process.env.ADMIN_PASSWORD),
    adminSessionSecret: required(
      "ADMIN_SESSION_SECRET",
      process.env.ADMIN_SESSION_SECRET
    ),
  };
}
