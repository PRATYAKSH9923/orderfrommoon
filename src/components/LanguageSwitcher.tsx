"use client";

import { useState, useRef, useEffect } from "react";
import { Languages, Check } from "lucide-react";
import { LANGS } from "@/lib/i18n";
import { useLang } from "@/components/LanguageProvider";
import { cn } from "@/lib/utils";

/**
 * Compact language switcher shown in the top-right. Tap to open a small menu of
 * the three languages; the choice is persisted by the LanguageProvider.
 *
 * `variant`:
 *  - "glass": translucent pill (for use over coloured/photo headers)
 *  - "solid": white pill (for use over light backgrounds)
 */
export function LanguageSwitcher({
  variant = "glass",
}: {
  variant?: "glass" | "solid";
}) {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold backdrop-blur transition-active active:scale-95",
          variant === "glass"
            ? "bg-white/20 text-white ring-1 ring-white/30"
            : "bg-white text-gray-700 shadow-sm ring-1 ring-gray-200"
        )}
      >
        <Languages className="size-4" />
        <span>{current.short}</span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-36 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5 animate-fade-in">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm active:bg-gray-100",
                l.code === lang ? "font-bold text-brand" : "text-gray-700"
              )}
            >
              {l.label}
              {l.code === lang && <Check className="size-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
