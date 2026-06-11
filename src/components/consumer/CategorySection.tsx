"use client";

import { ChevronDown } from "lucide-react";
import { CategoryWithItems } from "@/types";
import { useLang } from "@/components/LanguageProvider";
import { cn } from "@/lib/utils";
import { CategoryBanner } from "./CategoryBanner";
import { MenuItemCard } from "./MenuItemCard";

interface CategorySectionProps {
  category: CategoryWithItems;
  banners: string[];
  currency: string;
  open: boolean;
  onToggle: () => void;
  /** When searching, force-open and hide the collapse chevron. */
  forcedOpen?: boolean;
}

export function CategorySection({
  category,
  banners,
  currency,
  open,
  onToggle,
  forcedOpen = false,
}: CategorySectionProps) {
  const { t } = useLang();
  const expanded = forcedOpen || open;

  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
      {/* Banner */}
      <div className="p-2.5 pb-0">
        <CategoryBanner images={banners} alt={category.name} />
      </div>

      {/* Header (tap to toggle) */}
      <button
        onClick={forcedOpen ? undefined : onToggle}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
      >
        <div className="min-w-0">
          <h2 className="text-lg font-extrabold text-gray-900">
            {category.name}{" "}
            <span className="text-base font-semibold text-gray-400">
              ({category.items.length})
            </span>
          </h2>
          {category.description && (
            <p className="truncate text-xs text-gray-400">
              {category.description}
            </p>
          )}
        </div>
        {!forcedOpen && (
          <ChevronDown
            className={cn(
              "size-6 shrink-0 text-gray-400 transition-transform",
              expanded && "rotate-180"
            )}
          />
        )}
      </button>

      {/* Items */}
      {expanded && (
        <div className="animate-fade-in divide-y divide-gray-100 border-t border-gray-100 px-4">
          {category.items.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-400">
              {t("noResults")}
            </p>
          ) : (
            category.items.map((item) => (
              <MenuItemCard key={item.id} item={item} currency={currency} />
            ))
          )}
        </div>
      )}
    </section>
  );
}
