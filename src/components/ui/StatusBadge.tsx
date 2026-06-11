"use client";

import { OrderStatus } from "@/types";
import { cn } from "@/lib/utils";
import { useLang } from "@/components/LanguageProvider";
import type { StringKey } from "@/lib/i18n";

const styles: Record<OrderStatus, string> = {
  NEW: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-amber-100 text-amber-800",
  PREPARING: "bg-orange-100 text-orange-800",
  DONE: "bg-green-100 text-green-700",
};

export function StatusBadge({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  const { t } = useLang();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold",
        styles[status],
        className
      )}
    >
      {t(`status_${status}` as StringKey)}
    </span>
  );
}
