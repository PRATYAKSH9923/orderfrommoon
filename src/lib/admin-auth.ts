import "server-only";

import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import { serverEnv } from "@/lib/env";

const COOKIE_NAME = "bwx_admin";
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

/**
 * Minimal signed-cookie session for the single admin user. No DB, no user
 * management — credentials live in env (ADMIN_USERNAME / ADMIN_PASSWORD) and the
 * cookie is an HMAC over a fixed payload + expiry so it can't be forged.
 */

function sign(payload: string): string {
  const { adminSessionSecret } = serverEnv();
  return createHmac("sha256", adminSessionSecret).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** Validate username + password against env. */
export function verifyCredentials(username: string, password: string): boolean {
  const env = serverEnv();
  return (
    safeEqual(username, env.adminUsername) &&
    safeEqual(password, env.adminPassword)
  );
}

/** Create the session cookie (called after a successful login). */
export async function createAdminSession(): Promise<void> {
  const expires = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = `admin.${expires}`;
  const token = `${payload}.${sign(payload)}`;
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

/** Destroy the session cookie (logout). */
export async function destroyAdminSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

/** True if the current request carries a valid, unexpired admin session. */
export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [prefix, expiresStr, sig] = parts;
  const payload = `${prefix}.${expiresStr}`;

  if (!safeEqual(sig, sign(payload))) return false;

  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;
  return true;
}
