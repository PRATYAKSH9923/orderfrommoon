"use client";

import { Trash2 } from "lucide-react";
import { useCart } from "@/store/cart";
import { useLang } from "@/components/LanguageProvider";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { formatPrice } from "@/lib/utils";

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
  currency: string;
}

/** Cart review screen: list, qty +/-, remove, total, proceed to checkout. */
export function CartSheet({
  isOpen,
  onClose,
  onCheckout,
  currency,
}: CartSheetProps) {
  const { t } = useLang();
  const items = useCart((s) => s.items);
  const increase = useCart((s) => s.increase);
  const decrease = useCart((s) => s.decrease);
  const removeItem = useCart((s) => s.removeItem);
  const total = useCart((s) => s.total());

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("cart")}>
      {items.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          <p className="text-4xl">🛒</p>
          <p className="mt-3 font-medium">{t("emptyCart")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-2xl border border-gray-100 p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-snug text-gray-900">
                  {item.name}
                  {item.variantLabel && (
                    <span className="ml-1 text-xs font-medium text-gray-500">
                      ({item.variantLabel})
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  {formatPrice(item.price, currency)} ×{" "}
                  <span className="font-semibold">{item.quantity}</span> ={" "}
                  <span className="font-bold text-gray-900">
                    {formatPrice(item.price * item.quantity, currency)}
                  </span>
                </p>
              </div>
              <QuantityStepper
                size="sm"
                quantity={item.quantity}
                onIncrease={() => increase(item.id)}
                onDecrease={() => decrease(item.id)}
              />
              <button
                onClick={() => removeItem(item.id)}
                aria-label="Remove item"
                className="rounded-lg p-2 text-red-500 active:bg-red-50"
              >
                <Trash2 className="size-5" />
              </button>
            </div>
          ))}

          <div className="sticky bottom-0 -mx-4 border-t border-gray-100 bg-white px-4 pb-1 pt-3">
            <div className="mb-3 flex items-center justify-between text-lg font-bold">
              <span>{t("total")}</span>
              <span className="text-brand-secondary">
                {formatPrice(total, currency)}
              </span>
            </div>
            <Button size="lg" fullWidth onClick={onCheckout}>
              {t("checkout")}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
