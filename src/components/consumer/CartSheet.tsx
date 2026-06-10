"use client";

import { Trash2 } from "lucide-react";
import { useCart } from "@/store/cart";
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
  const items = useCart((s) => s.items);
  const increase = useCart((s) => s.increase);
  const decrease = useCart((s) => s.decrease);
  const removeItem = useCart((s) => s.removeItem);
  const total = useCart((s) => s.total());

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Your Cart · आपका कार्ट · ਕਾਰਟ">
      {items.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          <p className="text-4xl">🛒</p>
          <p className="mt-3 font-medium">
            Your cart is empty
            <br />
            <span className="text-sm">आपका कार्ट खाली है · ਤੁਹਾਡਾ ਕਾਰਟ ਖਾਲੀ ਹੈ</span>
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-2xl border border-gray-100 p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 leading-snug">
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
                  <span className="text-brand-secondary font-bold">
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
                className="p-2 text-red-500 active:bg-red-50 rounded-lg"
              >
                <Trash2 className="size-5" />
              </button>
            </div>
          ))}

          <div className="sticky bottom-0 -mx-4 border-t border-gray-100 bg-white px-4 pt-3 pb-1">
            <div className="mb-3 flex items-center justify-between text-lg font-bold">
              <span>Total · कुल · ਕੁੱਲ</span>
              <span className="text-brand-secondary">
                {formatPrice(total, currency)}
              </span>
            </div>
            <Button size="lg" fullWidth onClick={onCheckout}>
              Checkout · चेकआउट · ਚੈੱਕਆਊਟ
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
