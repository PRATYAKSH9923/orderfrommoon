"use client";

import { useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import { useCustomer } from "@/store/customer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { formatPrice } from "@/lib/utils";

interface CheckoutModalProps {
  isOpen: boolean;
  totalAmount: number;
  currency: string;
  onSubmit: (data: { name: string; phone: string }) => void;
  onClose: () => void;
  loading?: boolean;
}

export function CheckoutModal({
  isOpen,
  totalAmount,
  currency,
  onSubmit,
  onClose,
  loading = false,
}: CheckoutModalProps) {
  const { t } = useLang();
  const profile = useCustomer((s) => s.profile);
  // Prefill from the remembered profile (saved after the first order).
  const [name, setName] = useState(profile?.name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");
    if (!name.trim()) {
      setError(t("errName"));
      return;
    }
    if (phone.length < 10) {
      setError(t("errPhone"));
      return;
    }
    onSubmit({ name: name.trim(), phone });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("checkout")}
      dismissable={!loading}
      hideClose={loading}
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            {t("yourName")}
          </label>
          <Input
            type="text"
            inputMode="text"
            autoComplete="name"
            placeholder={t("namePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            {t("mobile")}
          </label>
          <Input
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            disabled={loading}
            maxLength={10}
          />
        </div>

        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

        <div className="rounded-xl bg-gray-100 p-4">
          <div className="flex items-center justify-between text-lg font-bold">
            <span>{t("total")}</span>
            <span className="text-brand-secondary">
              {formatPrice(totalAmount, currency)}
            </span>
          </div>
        </div>

        <Button size="lg" fullWidth onClick={handleSubmit} loading={loading}>
          {t("placeOrder")}
        </Button>
      </div>
    </Modal>
  );
}
