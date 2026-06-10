"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold " +
  "transition-active active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-brand/60 " +
  "select-none";

const sizes: Record<Size, string> = {
  // Touch-friendly: min 44px tall targets for one-hand operation.
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-base",
  lg: "h-14 px-6 text-lg",
};

const variants: Record<Variant, string> = {
  primary: "bg-brand text-brand-contrast shadow-sm active:brightness-95",
  secondary:
    "bg-brand-secondary text-white shadow-sm active:brightness-95",
  outline: "border-2 border-brand text-brand bg-white active:bg-brand/5",
  ghost: "text-brand active:bg-brand/10",
  danger: "bg-red-600 text-white shadow-sm active:brightness-95",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          base,
          sizes[size],
          variants[variant],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="size-5 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
