"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  size?: "sm" | "md";
}

/** Touch-friendly +/- stepper used in menu cards and cart rows. */
export function QuantityStepper({
  quantity,
  onIncrease,
  onDecrease,
  size = "md",
}: QuantityStepperProps) {
  const btn =
    size === "sm" ? "size-8" : "size-10";
  const icon = size === "sm" ? "size-4" : "size-5";

  return (
    <div className="inline-flex items-center rounded-xl bg-brand text-brand-contrast font-bold shadow-sm">
      <button
        onClick={onDecrease}
        aria-label="Decrease quantity"
        className={cn(btn, "flex items-center justify-center active:bg-black/10 rounded-l-xl")}
      >
        <Minus className={icon} />
      </button>
      <span className="min-w-7 text-center tabular-nums">{quantity}</span>
      <button
        onClick={onIncrease}
        aria-label="Increase quantity"
        className={cn(btn, "flex items-center justify-center active:bg-black/10 rounded-r-xl")}
      >
        <Plus className={icon} />
      </button>
    </div>
  );
}
