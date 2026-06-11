"use client";

import { useState } from "react";
import { UtensilsCrossed, X } from "lucide-react";
import { useLang } from "@/components/LanguageProvider";

interface MenuJumpButtonProps {
  categories: { id: string; name: string; count: number }[];
  onJump: (id: string) => void;
  /** Lift the button above the sticky cart bar when the cart has items. */
  raised?: boolean;
}

/**
 * Swiggy-style floating "MENU" button. Tapping it opens a sheet listing all
 * categories with item counts; choosing one expands and scrolls to that
 * section.
 */
export function MenuJumpButton({
  categories,
  onJump,
  raised = false,
}: MenuJumpButtonProps) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`fixed right-4 z-30 flex size-16 flex-col items-center justify-center rounded-full bg-gray-900 text-white shadow-xl transition-active active:scale-95 ${
          raised ? "bottom-24" : "bottom-5"
        }`}
        aria-label="Open menu list"
      >
        <UtensilsCrossed className="size-5" />
        <span className="mt-0.5 text-[11px] font-bold">{t("jumpToMenu")}</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/50 animate-fade-in"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="relative max-h-[70dvh] w-full max-w-md animate-slide-up overflow-hidden rounded-t-3xl bg-gray-900 text-white shadow-2xl">
            <div className="flex items-center justify-between px-5 py-3.5">
              <h2 className="text-base font-bold">{t("jumpToMenu")}</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-full p-1.5 text-white/70 active:bg-white/10"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="max-h-[58dvh] overflow-y-auto px-2 pb-4 safe-bottom">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setOpen(false);
                    // let the sheet close before scrolling
                    setTimeout(() => onJump(c.id), 120);
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left active:bg-white/10"
                >
                  <span className="font-medium">{c.name}</span>
                  <span className="text-white/60">{c.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
