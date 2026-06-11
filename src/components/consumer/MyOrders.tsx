"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Receipt } from "lucide-react";
import { OrderWithItems } from "@/types";
import { useCustomer } from "@/store/customer";
import { useLang } from "@/components/LanguageProvider";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { formatOrderTime, formatPrice } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FullPageSpinner } from "@/components/ui/Spinner";

export function MyOrders({ currency }: { currency: string }) {
  const { t } = useLang();
  const profile = useCustomer((s) => s.profile);
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  // Avoid SSR/hydration flash: only decide "no profile" after mount.
  const [mounted, setMounted] = useState(false);

  const phone = profile?.phone ?? null;

  const load = useCallback(async () => {
    if (!phone) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `/api/orders/by-phone?phone=${encodeURIComponent(phone)}`
      );
      const body = await res.json();
      setOrders(res.ok ? (body.orders ?? []) : []);
    } finally {
      setLoading(false);
    }
  }, [phone]);

  // Mark mounted (so the persisted profile has rehydrated) and load orders.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    void load();
  }, [load]);

  // Live status updates for this customer's orders.
  useEffect(() => {
    if (!phone) return;
    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel(`my-orders-${phone}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `customer_phone=eq.${phone}`,
        },
        (payload) => {
          const next = payload.new as Partial<OrderWithItems>;
          setOrders((prev) =>
            prev.map((o) => (o.id === next.id ? { ...o, ...next } : o))
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
          filter: `customer_phone=eq.${phone}`,
        },
        () => load()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [phone, load]);

  return (
    <div className="flex min-h-dvh flex-col bg-gray-50">
      <header className="safe-top sticky top-0 z-20 flex items-center gap-3 bg-brand px-4 py-3 text-brand-contrast shadow-md">
        <Link
          href="/consumer"
          aria-label="Back"
          className="-ml-1 rounded-full p-1 active:bg-white/20"
        >
          <ChevronLeft className="size-6" />
        </Link>
        <div className="min-w-0">
          <h1 className="text-lg font-bold leading-tight">{t("myOrders")}</h1>
          {phone && <p className="text-xs text-white/85">{phone}</p>}
        </div>
      </header>

      <main className="flex-1 p-4">
        {!mounted || loading ? (
          <FullPageSpinner />
        ) : !phone ? (
          <EmptyState
            icon="📱"
            text={t("noOrdersYet")}
            cta={t("backToMenu")}
          />
        ) : orders.length === 0 ? (
          <EmptyState icon="🧇" text={t("noOrdersYet")} cta={t("backToMenu")} />
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/order/${encodeURIComponent(
                  order.display_order_number.replace(/^#/, "")
                )}`}
                className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 active:bg-gray-50"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Receipt className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-extrabold text-brand-secondary">
                      {order.display_order_number}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {formatOrderTime(order.created_at)} ·{" "}
                    {order.order_items?.length ?? 0} {t("items")} ·{" "}
                    {formatPrice(order.total_amount, currency)}
                  </p>
                </div>
                <ChevronRight className="size-5 shrink-0 text-gray-300" />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function EmptyState({
  icon,
  text,
  cta,
}: {
  icon: string;
  text: string;
  cta: string;
}) {
  return (
    <div className="py-20 text-center text-gray-500">
      <p className="text-5xl">{icon}</p>
      <p className="mt-3 font-medium">{text}</p>
      <Link
        href="/consumer"
        className="mt-6 inline-block rounded-xl bg-brand px-5 py-3 font-semibold text-brand-contrast"
      >
        {cta}
      </Link>
    </div>
  );
}
