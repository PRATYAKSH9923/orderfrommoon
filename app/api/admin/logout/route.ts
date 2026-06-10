import { NextResponse } from "next/server";
import { destroyAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/** POST /api/admin/logout — clear the admin session cookie. */
export async function POST() {
  await destroyAdminSession();
  return NextResponse.json({ ok: true });
}
