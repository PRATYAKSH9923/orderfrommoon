import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { ORDER_STATUSES, OrderStatus } from "@/types";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/admin/orders/[id]/status — admin-only status change.
 * Uses the service_role key (bypasses RLS). The realtime publication on
 * `orders` pushes this update to the customer tracking page and the dashboard.
 */
export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const status = body.status as OrderStatus;
  if (!ORDER_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select("id, display_order_number, status, updated_at")
    .single();

  if (error || !data) {
    console.error("status update:", error?.message);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }

  return NextResponse.json({ order: data });
}
