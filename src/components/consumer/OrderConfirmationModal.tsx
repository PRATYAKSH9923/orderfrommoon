"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLang } from "@/components/LanguageProvider";
import { Modal } from "@/components/ui/Modal";
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
 * Shown after the order is CONFIRMED + saved. Fully automatic:
 *  - "Order Placed" + a disclaimer (in the active language).
 *  - A 10 → 0 countdown that starts immediately.
 *  - At 0, WhatsApp opens automatically and we redirect to the live tracking
 *    page. No manual buttons.
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
  const { t } = useLang();
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const doneRef = useRef(false);

  const trackingPath = `/order/${encodeURIComponent(
    orderNumber.replace(/^#/, "")
  )}`;

  // Countdown.
  useEffect(() => {
    if (!isOpen) return;
    if (secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [isOpen, secondsLeft]);

  // When the countdown reaches 0: open WhatsApp, then go to tracking.
  useEffect(() => {
    if (!isOpen || secondsLeft > 0 || doneRef.current) return;
    doneRef.current = true;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    // Give the new tab a moment, then navigate this tab to tracking.
    const id = setTimeout(() => router.push(trackingPath), 400);
    return () => clearTimeout(id);
  }, [isOpen, secondsLeft, whatsappUrl, router, trackingPath]);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} hideClose dismissable={false}>
      <div className="text-center">
        <CheckCircle2 className="mx-auto size-14 text-green-500" />
        <h2 className="mt-2 text-2xl font-extrabold text-gray-900">
          {t("orderPlaced")}
        </h2>

        <div className="mt-4 rounded-2xl bg-brand/10 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {t("orderNumber")}
          </p>
          <p className="text-3xl font-extrabold text-brand-secondary">
            {orderNumber}
          </p>
        </div>
      </div>

      {/* Items */}
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
          <span>{t("total")}</span>
          <span className="text-brand-secondary">
            {formatPrice(total, currency)}
          </span>
        </div>
      </div>

      {/* Disclaimer + automatic countdown */}
      <div className="mt-5 rounded-2xl border-2 border-green-500/40 bg-green-50 p-4 text-center">
        <p className="text-sm font-medium text-gray-700">{t("disclaimer")}</p>
        <div className="my-4 flex items-center justify-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-white shadow-inner ring-4 ring-green-500/20">
            <span className="text-4xl font-extrabold tabular-nums text-green-600">
              {secondsLeft}
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500">{t("openingWhatsApp")}</p>
      </div>

      <p className="mt-3 text-center text-[11px] text-gray-400">
        {restaurantName}
      </p>
    </Modal>
  );
}
