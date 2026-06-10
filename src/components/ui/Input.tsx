"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full h-12 rounded-xl border border-gray-300 bg-white px-4 text-base",
          "placeholder:text-gray-400 text-gray-900",
          "focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand",
          "disabled:bg-gray-100 disabled:text-gray-500",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
