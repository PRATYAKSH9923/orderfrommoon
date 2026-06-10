import {
  Category,
  CategoryWithItems,
  MenuItem,
  OrderWithItems,
  RestaurantSettings,
} from "@/types";
import {
  getSupabaseAdminClient,
  getSupabaseServerClient,
} from "@/lib/supabase/server";

import { publicEnv } from "@/lib/env";

/** True when Supabase public env is configured. */
function supabaseConfigured(): boolean {
  return Boolean(publicEnv.supabaseUrl && publicEnv.supabaseAnonKey);
}

/** Fetch the (single) restaurant settings row. Returns null if not seeded. */
export async function getRestaurantSettings(): Promise<RestaurantSettings | null> {
  if (!supabaseConfigured()) return null;
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("restaurant_settings")
    .select("*")
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("getRestaurantSettings:", error.message);
    return null;
  }
  return data as RestaurantSettings | null;
}

/** Fetch active categories with their available menu items, ordered. */
export async function getMenu(): Promise<CategoryWithItems[]> {
  if (!supabaseConfigured()) return [];
  const supabase = getSupabaseServerClient();

  const [{ data: cats, error: catErr }, { data: items, error: itemErr }] =
    await Promise.all([
      supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("menu_items")
        .select("*")
        .eq("is_available", true)
        .order("sort_order", { ascending: true }),
    ]);

  if (catErr) console.error("getMenu categories:", catErr.message);
  if (itemErr) console.error("getMenu items:", itemErr.message);

  const categories = (cats ?? []) as Category[];
  const menuItems = (items ?? []) as MenuItem[];

  return categories
    .map((c) => ({
      ...c,
      items: menuItems.filter((i) => i.category_id === c.id),
    }))
    .filter((c) => c.items.length > 0);
}

/** Fetch a single order (with items) by its human-readable number, e.g. "#101". */
export async function getOrderByNumber(
  displayOrderNumber: string
): Promise<OrderWithItems | null> {
  if (!supabaseConfigured()) return null;
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("display_order_number", displayOrderNumber)
    .maybeSingle();
  if (error) {
    console.error("getOrderByNumber:", error.message);
    return null;
  }
  return data as OrderWithItems | null;
}

/**
 * Fetch orders for the admin dashboard: all currently-active orders plus
 * today's completed ones (today's order history). Uses the service-role client
 * since this is called from a server-protected admin page.
 */
export async function getAdminOrders(): Promise<OrderWithItems[]> {
  const supabase = getSupabaseAdminClient();

  // Start of today (server local time) as ISO for the "today" filter.
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .or(
      `status.in.(NEW,ACCEPTED,PREPARING),and(status.eq.DONE,created_at.gte.${start.toISOString()})`
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAdminOrders:", error.message);
    return [];
  }
  return (data ?? []) as OrderWithItems[];
}
