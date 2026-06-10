"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Search, X, RefreshCw } from "lucide-react";
import { OrderStatus, OrderWithItems } from "@/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isToday } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { AdminOrderCard } from "./AdminOrderCard";

interface AdminDashboardProps {
  initialOrders: OrderWithItems[];
  currency: string;
  restaurantName: string;
}

type Tab = "active" | "completed";

const ACTIVE_STATUSES: OrderStatus[] = ["NEW", "ACCEPTED", "PREPARING"];

export function AdminDashboard({
  initialOrders,
  currency,
  restaurantName,
}: AdminDashboardProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderWithItems[]>(initialOrders);
  const [tab, setTab] = useState<Tab>("active");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [hasNewSinceView, setHasNewSinceView] = useState(false);

  // Mirror the active tab into a ref so the realtime callback (set up once)
  // can read the latest value without re-subscribing.
  const tabRef = useRef(tab);
  useEffect(() => {
    tabRef.current = tab;
  }, [tab]);

  // ---- Realtime: keep the order list live ---------------------------------
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const fetchOrderWithItems = async (id: string) => {
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", id)
        .maybeSingle();
      return data as OrderWithItems | null;
    };

    const channel = supabase
      .channel("admin-orders")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        async (payload) => {
          const full = await fetchOrderWithItems(
            (payload.new as { id: string }).id
          );
          if (!full) return;
          setOrders((prev) =>
            prev.some((o) => o.id === full.id) ? prev : [full, ...prev]
          );
          // Show the "new orders" dot when not already looking at the active tab.
          if (tabRef.current !== "active") setHasNewSinceView(true);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload) => {
          const next = payload.new as Partial<OrderWithItems>;
          setOrders((prev) =>
            prev.map((o) => (o.id === next.id ? { ...o, ...next } : o))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const selectTab = (next: Tab) => {
    setTab(next);
    if (next === "active") setHasNewSinceView(false);
  };

  // ---- Derived lists -------------------------------------------------------
  const newCount = orders.filter((o) => o.status === "NEW").length;

  const visibleOrders = useMemo(() => {
    const q = query.trim().replace(/^#/, "").toLowerCase();

    let list =
      tab === "active"
        ? orders.filter((o) => ACTIVE_STATUSES.includes(o.status))
        : // Completed tab shows today's DONE orders (today's order history).
          orders.filter((o) => o.status === "DONE" && isToday(o.created_at));

    if (q) {
      list = list.filter((o) =>
        o.display_order_number.replace(/^#/, "").toLowerCase().includes(q)
      );
    }

    // Active: oldest first (FIFO for the kitchen). Completed: newest first.
    return [...list].sort((a, b) =>
      tab === "active"
        ? a.created_at.localeCompare(b.created_at)
        : b.created_at.localeCompare(a.created_at)
    );
  }, [orders, tab, query]);

  // ---- Actions -------------------------------------------------------------
  const advance = async (id: string, next: OrderStatus) => {
    setBusyId(id);
    // Optimistic update.
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: next } : o))
    );
    try {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error("Failed");
    } catch {
      // Re-fetch on failure to resync.
      router.refresh();
    } finally {
      setBusyId(null);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin");
    router.refresh();
  };

  return (
    <div className="flex min-h-dvh flex-col bg-gray-50">
      <header className="sticky top-0 z-20 bg-brand-secondary text-white shadow-md safe-top">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-lg font-bold leading-tight">{restaurantName}</h1>
            <p className="text-xs text-white/80">Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => router.refresh()}
              aria-label="Refresh"
              className="p-2 rounded-full active:bg-white/20"
            >
              <RefreshCw className="size-5" />
            </button>
            <button
              onClick={logout}
              aria-label="Logout"
              className="flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-semibold active:bg-white/20"
            >
              <LogOut className="size-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-2">
          <TabButton
            active={tab === "active"}
            onClick={() => selectTab("active")}
            label="Active Orders"
            badge={newCount > 0 ? newCount : undefined}
            dot={tab !== "active" && hasNewSinceView}
          />
          <TabButton
            active={tab === "completed"}
            onClick={() => selectTab("completed")}
            label="Completed (Today)"
          />
        </div>
      </header>

      {/* Search by order id */}
      <div className="p-4 pb-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
          <Input
            inputMode="numeric"
            placeholder="Search order number… e.g. 101"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400"
            >
              <X className="size-5" />
            </button>
          )}
        </div>
      </div>

      <main className="flex-1 space-y-3 p-4 pt-2">
        {visibleOrders.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <p className="text-4xl">🧇</p>
            <p className="mt-3 font-medium">
              {tab === "active"
                ? "No active orders"
                : "No completed orders today"}
            </p>
          </div>
        ) : (
          visibleOrders.map((order) => (
            <AdminOrderCard
              key={order.id}
              order={order}
              currency={currency}
              onAdvance={advance}
              busy={busyId === order.id}
            />
          ))
        )}
      </main>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  badge,
  dot,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  badge?: number;
  dot?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex-1 border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
        active
          ? "border-white text-white"
          : "border-transparent text-white/70"
      }`}
    >
      {label}
      {badge !== undefined && (
        <span className="ml-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
          {badge}
        </span>
      )}
      {dot && (
        <span className="absolute right-2 top-2 size-2 rounded-full bg-red-500" />
      )}
    </button>
  );
}
