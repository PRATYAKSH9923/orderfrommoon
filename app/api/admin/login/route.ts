import { NextRequest, NextResponse } from "next/server";
import {
  verifyCredentials,
  createAdminSession,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/** POST /api/admin/login — validate env credentials, set session cookie. */
export async function POST(request: NextRequest) {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const username = body.username ?? "";
  const password = body.password ?? "";

  if (!verifyCredentials(username, password)) {
    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 }
    );
  }

  await createAdminSession();
  return NextResponse.json({ ok: true });
}
