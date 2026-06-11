import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conditional logic, de-duplicating conflicts. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Turn a category name into a URL/folder-safe slug, e.g. "The OGs" → "the-ogs". */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Format a number as a price string with the given currency symbol. */
export function formatPrice(amount: number, currency = "₹"): string {
  return `${currency}${amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(2)}`;
}

/** Format an ISO timestamp as a short local time (e.g. "10 Jun, 2:45 PM"). */
export function formatOrderTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/** Time-only (e.g. "2:45 PM") — used on compact admin cards. */
export function formatTimeOnly(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/** True if the given ISO timestamp falls on the current local day. */
export function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}
