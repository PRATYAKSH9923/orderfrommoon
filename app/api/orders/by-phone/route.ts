import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/orders/by-phone?phone=9876543210
 * Returns today's orders (with items) for the given mobile number, newest first.
 * Used by the customer "My Orders" history page (phone comes from localStorage).
 */
export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get("phone")?.trim();
  if (!phone || phone.replace(/\D/g, "").length < 10) {
    return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
  }

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("customer_phone", phone)
    .gte("created_at", start.toISOString())
    .order("created_at", { ascending: false });

  if (error) {
    console.error("by-phone:", error.message);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }

  return NextResponse.json({ orders: data ?? [] });
}
