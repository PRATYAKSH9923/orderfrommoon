import "server-only";

import { readdirSync } from "fs";
import { join } from "path";
import { slugify } from "@/lib/utils";

const EXT_ORDER = ["jpg", "jpeg", "png", "webp"];

/**
 * Look up which banner images exist for a category, by scanning
 * `public/menu/<slug>/`. Returns up to 3 public URLs (e.g. "/menu/the-ogs/1.jpg").
 * Runs on the server only; the result is passed to the client as plain strings.
 */
export function getCategoryBanners(categoryName: string): string[] {
  const slug = slugify(categoryName);
  const dir = join(process.cwd(), "public", "menu", slug);

  let files: string[] = [];
  try {
    files = readdirSync(dir);
  } catch {
    return []; // folder missing → placeholder will be shown
  }

  const found: string[] = [];
  for (const n of ["1", "2", "3"]) {
    const match = EXT_ORDER.map((ext) => `${n}.${ext}`).find((f) =>
      files.includes(f)
    );
    if (match) found.push(`/menu/${slug}/${match}`);
  }
  return found;
}

/** Map of categoryId → banner URLs, for a list of categories. */
export function bannersFor(
  categories: { id: string; name: string }[]
): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const c of categories) {
    out[c.id] = getCategoryBanners(c.name);
  }
  return out;
}
