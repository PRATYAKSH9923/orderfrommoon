"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, MessageCircle, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { CartItem } from "@/types";

interface OrderConfirmationModalProps {
  isOpen: boolean;
  orderNumber: string;
  items: CartItem[];
  total: number;
  customerName: string;
  customerPhone: string;
  whatsappUrl: string;
  currency: string;
  restaurantName: string;
}

const COUNTDOWN_SECONDS = 10;

/**
 * Shown after an order is saved. The order is ALREADY placed; this modal asks
 * the customer to *confirm* it by sending the order number on WhatsApp.
 *
 * Behaviour (per the brief):
 *  - Tapping "Confirm on WhatsApp" starts a 10 → 0 countdown.
 *  - Copy explains (in EN/HI/PA) that the order is already placed and they just
 *    need to send the order id on WhatsApp.
 *  - When the timer hits 0, WhatsApp opens automatically.
 *  - They can also tap "Open Now" to skip the wait.
 */
export function OrderConfirmationModal({
  isOpen,
  orderNumber,
  items,
  total,
  whatsappUrl,
  currency,
  restaurantName,
}: OrderConfirmationModalProps) {
  const router = useRouter();
  const [counting, setCounting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const openedRef = useRef(false);

  const openWhatsApp = () => {
    if (openedRef.current) return;
    openedRef.current = true;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    if (!counting) return;
    if (secondsLeft <= 0) {
      openWhatsApp();
      return;
    }
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counting, secondsLeft]);

  const startCountdown = () => {
    openedRef.current = false;
    setSecondsLeft(COUNTDOWN_SECONDS);
    setCounting(true);
  };

  const goToTracking = () => {
    // Order number like "#101" → route /order/101
    router.push(`/order/${encodeURIComponent(orderNumber.replace(/^#/, ""))}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={goToTracking}
      hideClose
      dismissable={false}
      title={undefined}
    >
      <div className="text-center">
        <CheckCircle2 className="mx-auto size-14 text-green-500" />
        <h2 className="mt-2 text-2xl font-extrabold text-gray-900">
          Order Placed!
        </h2>
        <p className="text-sm text-gray-500">
          ऑर्डर प्लेस हो गया! · ਆਰਡਰ ਪਲੇਸ ਹੋ ਗਿਆ!
        </p>

        <div className="mt-4 rounded-2xl bg-brand/10 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Order Number · ऑर्डर नंबर · ਆਰਡਰ ਨੰਬਰ
          </p>
          <p className="text-3xl font-extrabold text-brand-secondary">
            {orderNumber}
          </p>
        </div>
      </div>

      {/* Items + total */}
      <div className="mt-4 space-y-1.5 text-sm">
        {items.map((i) => (
          <div key={i.id} className="flex justify-between text-gray-700">
            <span className="pr-2">
              {i.name}
              {i.variantLabel ? ` (${i.variantLabel})` : ""} × {i.quantity}
            </span>
            <span className="font-semibold tabular-nums">
              {formatPrice(i.price * i.quantity, currency)}
            </span>
          </div>
        ))}
        <div className="mt-2 flex justify-between border-t border-gray-100 pt-2 text-base font-bold">
          <span>Total · कुल · ਕੁੱਲ</span>
          <span className="text-brand-secondary">
            {formatPrice(total, currency)}
          </span>
        </div>
      </div>

      {/* WhatsApp confirmation flow */}
      <div className="mt-5">
        {counting ? (
          <div className="rounded-2xl border-2 border-green-500/40 bg-green-50 p-4 text-center">
            <p className="font-semibold text-gray-800">
              Your order is already placed. Just confirm it by sending the order
              number on WhatsApp.
            </p>
            <p className="mt-1 text-sm text-gray-600">
              आपका ऑर्डर पहले ही प्लेस हो चुका है। बस व्हाट्सएप पर ऑर्डर नंबर
              भेजकर पुष्टि करें।
            </p>
            <p className="mt-1 text-sm text-gray-600">
              ਤੁਹਾਡਾ ਆਰਡਰ ਪਹਿਲਾਂ ਹੀ ਪਲੇਸ ਹੋ ਚੁੱਕਾ ਹੈ। ਬੱਸ ਵਟਸਐਪ &apos;ਤੇ ਆਰਡਰ
              ਨੰਬਰ ਭੇਜ ਕੇ ਪੁਸ਼ਟੀ ਕਰੋ।
            </p>

            <div className="my-4 flex items-center justify-center">
              <div className="relative flex size-20 items-center justify-center">
                <span className="text-4xl font-extrabold tabular-nums text-green-600">
                  {secondsLeft}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Opening WhatsApp… · व्हाट्सएप खुल रहा है… · ਵਟਸਐਪ ਖੁੱਲ੍ਹ ਰਿਹਾ ਹੈ…
            </p>

            <Button
              variant="secondary"
              fullWidth
              className="mt-3 bg-green-600"
              onClick={openWhatsApp}
            >
              <ExternalLink className="size-5" />
              Open Now · अभी खोलें · ਹੁਣੇ ਖੋਲ੍ਹੋ
            </Button>
          </div>
        ) : (
          <Button
            fullWidth
            size="lg"
            className="bg-green-600 text-white"
            onClick={startCountdown}
          >
            <MessageCircle className="size-5" />
            Confirm on WhatsApp · व्हाट्सएप पर पुष्टि करें
          </Button>
        )}

        <Button variant="outline" fullWidth className="mt-3" onClick={goToTracking}>
          Track Order · ऑर्डर ट्रैक करें · ਆਰਡਰ ਟਰੈਕ ਕਰੋ
        </Button>
      </div>

      <p className="mt-3 text-center text-[11px] text-gray-400">
        {restaurantName}
      </p>
    </Modal>
  );
}
