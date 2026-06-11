"use client";

import { Phone, User, Clock } from "lucide-react";
import { OrderStatus, OrderWithItems } from "@/types";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatOrderTime, formatPrice } from "@/lib/utils";
import { useLang } from "@/components/LanguageProvider";
import type { StringKey } from "@/lib/i18n";

interface AdminOrderCardProps {
  order: OrderWithItems;
  currency: string;
  onAdvance: (id: string, next: OrderStatus) => void;
  busy?: boolean;
}

/** The next status + button label key for the primary action on a card. */
function nextAction(
  status: OrderStatus
): { next: OrderStatus; labelKey: StringKey } | null {
  switch (status) {
    case "NEW":
      return { next: "ACCEPTED", labelKey: "accept" };
    case "ACCEPTED":
      return { next: "PREPARING", labelKey: "moveToPreparing" };
    case "PREPARING":
      return { next: "DONE", labelKey: "moveToDone" };
    default:
      return null;
  }
}

export function AdminOrderCard({
  order,
  currency,
  onAdvance,
  busy = false,
}: AdminOrderCardProps) {
  const { t } = useLang();
  const action = nextAction(order.status);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-2xl font-extrabold text-brand-secondary leading-none">
            {order.display_order_number}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
            <Clock className="size-3.5" />
            {formatOrderTime(order.created_at)}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <span className="flex items-center gap-1.5 font-semibold text-gray-800">
          <User className="size-4 text-gray-400" />
          {order.customer_name}
        </span>
        <a
          href={`tel:${order.customer_phone}`}
          className="flex items-center gap-1.5 font-medium text-blue-600 active:underline"
        >
          <Phone className="size-4" />
          {order.customer_phone}
        </a>
      </div>

      <div className="mt-3 rounded-xl bg-gray-50 p-3 text-sm">
        {order.order_items?.map((item) => (
          <div key={item.id} className="flex justify-between text-gray-700">
            <span>
              <span className="font-semibold">{item.quantity}×</span> {item.name}
              {item.variant_label ? ` (${item.variant_label})` : ""}
            </span>
            <span className="tabular-nums">
              {formatPrice(item.line_total, currency)}
            </span>
          </div>
        ))}
        <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 font-bold">
          <span>Total</span>
          <span className="text-brand-secondary">
            {formatPrice(order.total_amount, currency)}
          </span>
        </div>
      </div>

      {action && (
        <Button
          fullWidth
          size="lg"
          className="mt-3"
          loading={busy}
          onClick={() => onAdvance(order.id, action.next)}
        >
          {t(action.labelKey)}
        </Button>
      )}
    </div>
  );
}
