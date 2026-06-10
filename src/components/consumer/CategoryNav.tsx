"use client";

import { cn } from "@/lib/utils";

interface CategoryNavProps {
  categories: { id: string; name: string }[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

/** Horizontally scrollable category chips for quick jump-to-section. */
export function CategoryNav({
  categories,
  activeId,
  onSelect,
}: CategoryNavProps) {
  return (
    <nav className="sticky top-[104px] z-20 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-2.5">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition-active",
              activeId === c.id
                ? "bg-brand text-brand-contrast"
                : "bg-gray-100 text-gray-700 active:bg-gray-200"
            )}
          >
            {c.name}
          </button>
        ))}
      </div>
    </nav>
  );
}
