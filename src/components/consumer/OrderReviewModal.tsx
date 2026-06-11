"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { CartItem } from "@/types";
import { useLang } from "@/components/LanguageProvider";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatPrice } from "@/lib/utils";

interface OrderReviewModalProps {
  isOpen: boolean;
  items: CartItem[];
  total: number;
  currency: string;
  customerName: string;
  customerPhone: string;
  loading: boolean;
  /** Confirm with the (possibly edited) customer details. */
  onConfirm: (details: { name: string; phone: string }) => void;
  onBack: () => void;
}

/**
 * Step 2 of checkout. The order is NOT placed yet — this shows the final list of
 * items + prices for the customer to review. Only tapping "Confirm Order"
 * actually saves the order.
 */
export function OrderReviewModal({
  isOpen,
  items,
  total,
  currency,
  customerName,
  customerPhone,
  loading,
  onConfirm,
  onBack,
}: OrderReviewModalProps) {
  const { t } = useLang();
  // Initialised from props; the parent remounts this with a key when the
  // details change, so no syncing effect is needed.
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(customerName);
  const [phone, setPhone] = useState(customerPhone);
  const [err, setErr] = useState("");

  const handleConfirm = () => {
    setErr("");
    if (!name.trim()) {
      setErr(t("errName"));
      setEditing(true);
      return;
    }
    if (phone.length < 10) {
      setErr(t("errPhone"));
      setEditing(true);
      return;
    }
    onConfirm({ name: name.trim(), phone });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onBack}
      title={t("reviewOrder")}
      dismissable={!loading}
      hideClose={loading}
    >
      <div className="space-y-3">
        {/* Customer — editable so a wrong number can be corrected */}
        <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm">
          {editing ? (
            <div className="space-y-2">
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("yourName")}
                className="h-10"
                disabled={loading}
              />
              <Input
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder={t("mobile")}
                maxLength={10}
                className="h-10"
                disabled={loading}
              />
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="font-semibold text-gray-900">{name}</span>
                <span className="text-gray-500"> · {phone}</span>
              </div>
              <button
                onClick={() => setEditing(true)}
                disabled={loading}
                className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-brand active:bg-brand/10"
              >
                <Pencil className="size-3.5" />
                {t("edit")}
              </button>
            </div>
          )}
          {err && <p className="mt-2 text-xs font-semibold text-red-600">{err}</p>}
        </div>

        {/* Items */}
        <div className="divide-y divide-gray-100 rounded-xl border border-gray-100">
          {items.map((i) => (
            <div
              key={i.id}
              className="flex items-center justify-between gap-3 px-4 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-gray-900">
                  {i.name}
                  {i.variantLabel && (
                    <span className="ml-1 text-xs font-semibold text-amber-700">
                      ({i.variantLabel})
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  {formatPrice(i.price, currency)} × {i.quantity}
                </p>
              </div>
              <span className="font-semibold tabular-nums text-gray-900">
                {formatPrice(i.price * i.quantity, currency)}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between rounded-xl bg-gray-100 px-4 py-3 text-lg font-bold">
          <span>{t("total")}</span>
          <span className="text-brand-secondary">
            {formatPrice(total, currency)}
          </span>
        </div>

        <div className="flex gap-3 pt-1">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={onBack}
            disabled={loading}
          >
            {t("back")}
          </Button>
          <Button
            size="lg"
            className="flex-2"
            onClick={handleConfirm}
            loading={loading}
          >
            {t("confirmOrder")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
