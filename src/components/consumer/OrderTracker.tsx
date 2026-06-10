"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Clock, ChefHat, PartyPopper, Home } from "lucide-react";
import { OrderStatus, OrderWithItems } from "@/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { formatOrderTime, formatPrice, cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";

const STEPS: {
  status: OrderStatus;
  label: string;
  sub: string;
  icon: typeof Check;
}[] = [
  { status: "NEW", label: "New", sub: "नया · ਨਵਾਂ", icon: Check },
  { status: "ACCEPTED", label: "Accepted", sub: "स्वीकृत · ਸਵੀਕਾਰ", icon: Clock },
  {
    status: "PREPARING",
    label: "Preparing",
    sub: "तैयार हो रहा है · ਤਿਆਰ",
    icon: ChefHat,
  },
  { status: "DONE", label: "Done", sub: "तैयार · ਤਿਆਰ", icon: PartyPopper },
];

const ORDER: OrderStatus[] = ["NEW", "ACCEPTED", "PREPARING", "DONE"];

export function OrderTracker({
  initialOrder,
  currency,
}: {
  initialOrder: OrderWithItems;
  currency: string;
}) {
  const [order, setOrder] = useState<OrderWithItems>(initialOrder);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    // Subscribe to updates for THIS order only.
    const channel = supabase
      .channel(`order-${order.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${order.id}`,
        },
        (payload) => {
          const next = payload.new as Partial<OrderWithItems>;
          setOrder((prev) => ({ ...prev, ...next }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [order.id]);

  const currentIndex = ORDER.indexOf(order.status);

  return (
    <div className="flex min-h-dvh flex-col bg-gray-50">
      <header className="sticky top-0 z-20 flex items-center gap-3 bg-brand px-4 py-3 text-brand-contrast shadow-md safe-top">
        <Link href="/" aria-label="Home" className="p-1 active:bg-white/20 rounded-full">
          <Home className="size-6" />
        </Link>
        <div>
          <h1 className="text-lg font-bold leading-tight">Track Order</h1>
          <p className="text-xs text-white/90">ऑर्डर ट्रैक · ਆਰਡਰ ਟਰੈਕ</p>
        </div>
      </header>

      <main className="flex-1 space-y-4 p-4">
        {/* Order number + live badge */}
        <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Order Number
          </p>
          <p className="text-4xl font-extrabold text-brand-secondary">
            {order.display_order_number}
          </p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <StatusBadge status={order.status} />
            <span className="flex items-center gap-1 text-xs text-green-600">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-green-500" />
              </span>
              Live
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {formatOrderTime(order.created_at)}
          </p>
        </div>

        {/* Status timeline */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <ol className="space-y-1">
            {STEPS.map((step, i) => {
              const done = i <= currentIndex;
              const active = i === currentIndex;
              const Icon = step.icon;
              return (
                <li key={step.status} className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "flex size-10 items-center justify-center rounded-full transition-colors",
                        done
                          ? "bg-brand text-brand-contrast"
                          : "bg-gray-100 text-gray-400",
                        active && "ring-4 ring-brand/20"
                      )}
                    >
                      <Icon className="size-5" />
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className={cn(
                          "my-1 h-8 w-0.5",
                          i < currentIndex ? "bg-brand" : "bg-gray-200"
                        )}
                      />
                    )}
                  </div>
                  <div className={cn("pb-2", !done && "opacity-50")}>
                    <p className="font-bold text-gray-900">{step.label}</p>
                    <p className="text-xs text-gray-500">{step.sub}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Items */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-2 font-bold text-gray-900">Your Items</h2>
          <div className="space-y-1.5 text-sm">
            {order.order_items?.map((item) => (
              <div key={item.id} className="flex justify-between text-gray-700">
                <span>
                  {item.name}
                  {item.variant_label ? ` (${item.variant_label})` : ""} ×{" "}
                  {item.quantity}
                </span>
                <span className="font-semibold tabular-nums">
                  {formatPrice(item.line_total, currency)}
                </span>
              </div>
            ))}
            <div className="mt-2 flex justify-between border-t border-gray-100 pt-2 font-bold">
              <span>Total · कुल · ਕੁੱਲ</span>
              <span className="text-brand-secondary">
                {formatPrice(order.total_amount, currency)}
              </span>
            </div>
          </div>
        </div>

        <p className="pb-6 text-center text-xs text-gray-400">
          This page updates automatically — no need to refresh.
          <br />
          यह पेज अपने आप अपडेट होता है · ਇਹ ਪੇਜ ਆਪਣੇ ਆਪ ਅੱਪਡੇਟ ਹੁੰਦਾ ਹੈ
        </p>
      </main>
    </div>
  );
}
