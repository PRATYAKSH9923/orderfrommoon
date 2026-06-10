"use client";

import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  /** Hide the close button (e.g. for a forced confirmation flow). */
  hideClose?: boolean;
  /** Disable closing on backdrop click. */
  dismissable?: boolean;
}

/**
 * Mobile-first modal that renders as a bottom sheet on small screens and a
 * centered dialog on larger screens. Locks body scroll while open.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  hideClose = false,
  dismissable = true,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !dismissable) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, dismissable, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={dismissable ? onClose : undefined}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full sm:max-w-md bg-white shadow-xl animate-slide-up",
          "rounded-t-3xl sm:rounded-3xl max-h-[90dvh] flex flex-col"
        )}
      >
        {(title || !hideClose) && (
          <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            {!hideClose && (
              <button
                onClick={onClose}
                aria-label="Close"
                className="p-2 -mr-2 rounded-full text-gray-500 active:bg-gray-100"
              >
                <X className="size-5" />
              </button>
            )}
          </div>
        )}
        <div className="overflow-y-auto p-4 safe-bottom">{children}</div>
      </div>
    </div>,
    document.body
  );
}
