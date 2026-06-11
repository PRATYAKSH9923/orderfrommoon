"use client";

import { MenuItem } from "@/types";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { useLang } from "@/components/LanguageProvider";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Plus, Star } from "lucide-react";

interface MenuItemCardProps {
  item: MenuItem;
  currency: string;
}

/**
 * A single menu item row — clean & readable, no per-item photo.
 *
 * For waffle cakes (items with a secondary "Double Layer" price) the customer
 * picks a total quantity and how many of those are double-layer. The double
 * count can never exceed the total. Internally this maps to two cart lines
 * (single + double) so the order detail shows them separately.
 */
export function MenuItemCard({ item, currency }: MenuItemCardProps) {
  const { t } = useLang();
  const items = useCart((s) => s.items);
  const addItem = useCart((s) => s.addItem);
  const increase = useCart((s) => s.increase);
  const decrease = useCart((s) => s.decrease);
  const setCake = useCart((s) => s.setCake);

  const hasVariant = item.secondary_price != null && !!item.secondary_label;

  // ---- Cake (single/double-layer) variant ---------------------------------
  if (hasVariant) {
    const baseLine = items.find((i) => i.id === item.id);
    const doubleLine = items.find(
      (i) => i.id === `${item.id}::${item.secondary_label}`
    );
    const single = baseLine?.quantity ?? 0;
    const double = doubleLine?.quantity ?? 0;
    const total = single + double;

    return (
      <div className="py-3.5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            {item.is_bestseller && <BestsellerTag label={t("bestseller")} />}
            <h3 className="font-semibold leading-snug text-gray-900">
              {item.name}
            </h3>
            {item.description && (
              <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-gray-500">
                {item.description}
              </p>
            )}
            <div className="mt-1.5 font-bold text-gray-900">
              {formatPrice(item.price, currency)}
              <span className="ml-2 text-sm font-medium text-gray-400">
                · {item.secondary_label}{" "}
                {formatPrice(item.secondary_price!, currency)}
              </span>
            </div>
          </div>

          <div className="w-28 shrink-0">
            {total === 0 ? (
              <button
                onClick={() => setCake(item, 1, 0)}
                className="inline-flex h-9 w-full items-center justify-center gap-1 rounded-xl border-2 border-brand bg-white text-sm font-bold uppercase text-brand shadow-sm active:bg-brand/10"
              >
                <Plus className="size-4" />
                {t("add")}
              </button>
            ) : (
              <div className="self-center">
                <QuantityStepper
                  size="sm"
                  quantity={total}
                  onIncrease={() => setCake(item, total + 1, double)}
                  onDecrease={() => setCake(item, total - 1, double)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Double-layer selector — only when at least one cake is in the cart */}
        {total > 0 && (
          <div className="mt-2.5 flex items-center justify-between rounded-xl bg-amber-50 px-3 py-2">
            <span className="text-sm font-medium text-amber-900">
              {t("doubleLayer")}{" "}
              <span className="text-amber-600">
                ({double} {t("ofWord")} {total})
              </span>
            </span>
            <QuantityStepper
              size="sm"
              quantity={double}
              onIncrease={() =>
                setCake(item, total, Math.min(double + 1, total))
              }
              onDecrease={() => setCake(item, total, Math.max(double - 1, 0))}
            />
          </div>
        )}
      </div>
    );
  }

  // ---- Normal item --------------------------------------------------------
  const line = items.find((i) => i.id === item.id);
  return (
    <div className="flex items-start justify-between gap-4 py-3.5">
      <div className="min-w-0 flex-1">
        {item.is_bestseller && <BestsellerTag label={t("bestseller")} />}
        <h3 className="font-semibold leading-snug text-gray-900">{item.name}</h3>
        {item.description && (
          <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-gray-500">
            {item.description}
          </p>
        )}
        <div className="mt-1.5 font-bold text-gray-900">
          {formatPrice(item.price, currency)}
        </div>
      </div>

      <div className="w-28 shrink-0">
        {line ? (
          <div className="self-center">
            <QuantityStepper
              size="sm"
              quantity={line.quantity}
              onIncrease={() => increase(line.id)}
              onDecrease={() => decrease(line.id)}
            />
          </div>
        ) : (
          <button
            onClick={() => addItem(item)}
            className="inline-flex h-9 w-full items-center justify-center gap-1 rounded-xl border-2 border-brand bg-white text-sm font-bold uppercase text-brand shadow-sm active:bg-brand/10"
          >
            <Plus className="size-4" />
            {t("add")}
          </button>
        )}
      </div>
    </div>
  );
}

function BestsellerTag({ label }: { label: string }) {
  return (
    <span className="mb-1 inline-flex items-center gap-1 rounded-md bg-amber-100 px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-700">
      <Star className="size-3 fill-amber-500 text-amber-500" />
      {label}
    </span>
  );
}
