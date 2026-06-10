"use client";

import { useState } from "react";
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
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");
    if (!name.trim()) {
      setError("Please enter your name · कृपया नाम दर्ज करें · ਨਾਮ ਦਰਜ ਕਰੋ");
      return;
    }
    if (phone.length < 10) {
      setError(
        "Enter a valid 10-digit number · सही फोन नंबर दर्ज करें · ਸਹੀ ਫੋਨ ਨੰਬਰ ਦਰਜ ਕਰੋ"
      );
      return;
    }
    onSubmit({ name: name.trim(), phone });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Checkout · चेकआउट · ਚੈੱਕਆਊਟ"
      dismissable={!loading}
      hideClose={loading}
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            Your Name · आपका नाम · ਤੁਹਾਡਾ ਨਾਮ
          </label>
          <Input
            type="text"
            inputMode="text"
            autoComplete="name"
            placeholder="Name / नाम / ਨਾਮ"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            Mobile Number · मोबाइल नंबर · ਮੋਬਾਈਲ ਨੰਬਰ
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

        {error && (
          <p className="text-sm font-semibold text-red-600">{error}</p>
        )}

        <div className="rounded-xl bg-gray-100 p-4">
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total · कुल · ਕੁੱਲ</span>
            <span className="text-brand-secondary">
              {formatPrice(totalAmount, currency)}
            </span>
          </div>
        </div>

        <Button size="lg" fullWidth onClick={handleSubmit} loading={loading}>
          {loading
            ? "Placing… · प्रोसेसिंग… · ਪ੍ਰੋਸੈਸਿੰਗ…"
            : "Place Order · ऑर्डर प्लेस करें · ਆਰਡਰ ਪਲੇਸ ਕਰੋ"}
        </Button>
      </div>
    </Modal>
  );
}
