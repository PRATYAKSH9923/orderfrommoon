"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

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
  return (
    <header className="sticky top-0 z-30 bg-brand text-brand-contrast shadow-md safe-top">
      <div className="flex items-center gap-2 px-4 pt-3">
        <Link
          href="/"
          aria-label="Back"
          className="-ml-1 p-1 rounded-full active:bg-white/20"
        >
          <ChevronLeft className="size-6" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-extrabold leading-tight">
            {restaurantName}
          </h1>
          {tagline && (
            <p className="truncate text-xs text-white/90">{tagline}</p>
          )}
        </div>
      </div>

      <div className="px-4 pb-3 pt-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search menu… / मेन्यू खोजें / ਮੀਨੂੰ ਖੋਜੋ"
            className="h-11 w-full rounded-xl bg-white pl-10 pr-10 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/60"
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
      </div>
    </header>
  );
}
