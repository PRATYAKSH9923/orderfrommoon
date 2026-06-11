"use client";

import { Search, X, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useLang } from "@/components/LanguageProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useCustomer } from "@/store/customer";

interface ConsumerHeaderProps {
  restaurantName: string;
  tagline?: string | null;
  query: string;
  onQueryChange: (q: string) => void;
}

export function ConsumerHeader({
  restaurantName,
  tagline,
  query,
  onQueryChange,
}: ConsumerHeaderProps) {
  const { t } = useLang();
  const hasProfile = useCustomer((s) => s.profile !== null);

  return (
    <header className="sticky top-0 z-30 bg-brand text-brand-contrast shadow-lg safe-top">
      {/* Title row — scrolls away */}
      <div className="flex items-center gap-2 px-4 pt-3">
        <Link
          href="/"
          aria-label="Back"
          className="-ml-1 rounded-full p-1 active:bg-white/20"
        >
          <ChevronLeft className="size-6" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-extrabold leading-tight">
            {restaurantName}
          </h1>
          {tagline && (
            <p className="truncate text-xs text-white/85">{tagline}</p>
          )}
        </div>
        <LanguageSwitcher variant="glass" />
      </div>

      {/* Search row + My Orders — stays visible */}
      <div className="flex items-center gap-2 px-4 pb-3 pt-2.5">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={t("searchMenu")}
            className="h-11 w-full rounded-2xl bg-white pl-10 pr-10 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/60"
          />
          {query && (
            <button
              onClick={() => onQueryChange("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 active:text-gray-600"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        {hasProfile && (
          <Link
            href="/my-orders"
            className="flex h-11 shrink-0 items-center rounded-2xl bg-white/20 px-3 text-sm font-semibold ring-1 ring-white/30 active:bg-white/30"
          >
            {t("myOrders")}
          </Link>
        )}
      </div>
    </header>
  );
}
