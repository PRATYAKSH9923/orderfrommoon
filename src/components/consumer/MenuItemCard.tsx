"use client";

import { MenuItem } from "@/types";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Plus, Star } from "lucide-react";

interface MenuItemCardProps {
  item: MenuItem;
  currency: string;
}

/**
 * A single menu item row. No photos (per brief — text menu replicated from the
 * printed card). Supports an optional second price/variant (e.g. waffle cakes
 * single vs double layer) via a small variant selector.
 */
export function MenuItemCard({ item, currency }: MenuItemCardProps) {
  const items = useCart((s) => s.items);
  const addItem = useCart((s) => s.addItem);
  const increase = useCart((s) => s.increase);
  const decrease = useCart((s) => s.decrease);

  const hasVariant = item.secondary_price != null;

  // Base (single) line in cart.
  const baseLine = items.find((i) => i.id === item.id);
  // Variant line in cart.
  const variantLine = hasVariant
    ? items.find((i) => i.id === `${item.id}::${item.secondary_label}`)
    : undefined;

  return (
    <div className="flex items-start justify-between gap-3 py-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <h3 className="font-semibold text-gray-900 leading-snug">
            {item.name}
          </h3>
          {item.is_bestseller && (
            <Star className="size-4 shrink-0 fill-amber-400 text-amber-400" />
          )}
        </div>
        {item.description && (
          <p className="mt-0.5 text-sm text-gray-500 leading-snug">
            {item.description}
          </p>
        )}
        <div className="mt-1 text-brand-secondary font-bold">
          {formatPrice(item.price, currency)}
          {hasVariant && (
            <span className="ml-2 text-sm font-medium text-gray-500">
              · {item.secondary_label} {formatPrice(item.secondary_price!, currency)}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 pt-0.5">
        {/* Primary / single add control */}
        {baseLine ? (
          <QuantityStepper
            size="sm"
            quantity={baseLine.quantity}
            onIncrease={() => increase(baseLine.id)}
            onDecrease={() => decrease(baseLine.id)}
          />
        ) : (
          <button
            onClick={() => addItem(item)}
            className="inline-flex items-center gap-1 rounded-xl border-2 border-brand px-3 h-9 text-sm font-bold text-brand active:bg-brand/10"
          >
            <Plus className="size-4" />
            {hasVariant ? "Single" : "Add"}
          </button>
        )}

        {/* Variant add control (e.g. Double Layer) */}
        {hasVariant &&
          (variantLine ? (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">
                {item.secondary_label}
              </span>
              <QuantityStepper
                size="sm"
                quantity={variantLine.quantity}
                onIncrease={() => increase(variantLine.id)}
                onDecrease={() => decrease(variantLine.id)}
              />
            </div>
          ) : (
            <button
              onClick={() =>
                addItem(item, {
                  label: item.secondary_label!,
                  price: item.secondary_price!,
                })
              }
              className="inline-flex items-center gap-1 rounded-xl border border-gray-300 px-3 h-8 text-xs font-semibold text-gray-700 active:bg-gray-100"
            >
              <Plus className="size-3.5" />
              {item.secondary_label}
            </button>
          ))}
      </div>
    </div>
  );
}
