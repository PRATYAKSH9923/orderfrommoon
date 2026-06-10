"use client";

import { useEffect } from "react";
import { RestaurantSettings } from "@/types";

/**
 * Applies the restaurant's branding colours (from `restaurant_settings`) to the
 * document as CSS custom properties, so all `bg-brand` / `text-brand` utilities
 * and inline `var(--brand-*)` references pick them up. Returns nothing visible.
 */
export function BrandProvider({ settings }: { settings: RestaurantSettings | null }) {
  useEffect(() => {
    if (!settings) return;
    const root = document.documentElement;
    root.style.setProperty("--brand-primary", settings.primary_color);
    root.style.setProperty("--brand-secondary", settings.secondary_color);
    root.style.setProperty(
      "--brand-primary-contrast",
      pickContrast(settings.primary_color)
    );
  }, [settings]);

  return null;
}

/** Choose black or white text for legibility on a given hex background. */
function pickContrast(hex: string): string {
  const c = hex.replace("#", "");
  if (c.length !== 6) return "#ffffff";
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  // Relative luminance (sRGB) — threshold ~0.6 for warm brand colours.
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#1a1a1a" : "#ffffff";
}
