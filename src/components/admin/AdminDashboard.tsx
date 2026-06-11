"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Search, X, RefreshCw } from "lucide-react";
import { OrderStatus, OrderWithItems } from "@/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isToday } from "@/lib/utils";
import { useLang } from "@/components/LanguageProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Input } from "@/components/ui/Input";
import { AdminOrderCard } from "./AdminOrderCard";

interface AdminDashboardProps {
  initialOrders: OrderWithItems[];
  currency: string;
  restaurantName: string;
}

// Parent tabs and the Active sub-tabs.
// Flow: Requested (NEW) → To-do (ACCEPTED) → Preparing (PREPARING) → Done (DONE)
type ParentTab = "requested" | "active" | "done";
type ActiveSub = "todo" | "preparing";

export function AdminDashboard({
  initialOrders,
  currency,
  restaurantName,
}: AdminDashboardProps) {
  const { t } = useLang();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderWithItems[]>(initialOrders);
  const [tab, setTab] = useState<ParentTab>("requested");
  const [sub, setSub] = useState<ActiveSub>("todo");
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
          // Flag new requests when not currently viewing the Requested tab.
          if (tabRef.current !== "requested") setHasNewSinceView(true);
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

  const selectTab = (next: ParentTab) => {
    setTab(next);
    if (next === "requested") setHasNewSinceView(false);
  };

  // ---- Counts --------------------------------------------------------------
  const newCount = orders.filter((o) => o.status === "NEW").length;
  const todoCount = orders.filter((o) => o.status === "ACCEPTED").length;
  const preparingCount = orders.filter((o) => o.status === "PREPARING").length;
  const activeCount = todoCount + preparingCount;

  // The status shown by the current (parent + sub) selection.
  const currentStatus: OrderStatus =
    tab === "requested"
      ? "NEW"
      : tab === "done"
        ? "DONE"
        : sub === "todo"
          ? "ACCEPTED"
          : "PREPARING";

  const visibleOrders = useMemo(() => {
    const q = query.trim().replace(/^#/, "").toLowerCase();

    let list = orders.filter((o) => {
      if (o.status !== currentStatus) return false;
      // Done = today's completed orders only.
      if (currentStatus === "DONE") return isToday(o.created_at);
      return true;
    });

    if (q) {
      list = list.filter((o) =>
        o.display_order_number.replace(/^#/, "").toLowerCase().includes(q)
      );
    }

    // Done: newest first. Everything else: oldest first (FIFO for the kitchen).
    return [...list].sort((a, b) =>
      currentStatus === "DONE"
        ? b.created_at.localeCompare(a.created_at)
        : a.created_at.localeCompare(b.created_at)
    );
  }, [orders, currentStatus, query]);

  const emptyKey =
    currentStatus === "NEW"
      ? "noRequested"
      : currentStatus === "ACCEPTED"
        ? "noTodo"
        : currentStatus === "PREPARING"
          ? "noPreparing"
          : "noDone";

  // ---- Actions -------------------------------------------------------------
  const advance = async (id: string, next: OrderStatus) => {
    setBusyId(id);
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
      <header className="safe-top sticky top-0 z-20 bg-brand-secondary text-white shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold leading-tight">
              {restaurantName}
            </h1>
            <p className="text-xs text-white/80">{t("dashboard")}</p>
          </div>
          <div className="flex items-center gap-1">
            <LanguageSwitcher variant="glass" />
            <button
              onClick={() => router.refresh()}
              aria-label="Refresh"
              className="rounded-full p-2 active:bg-white/20"
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

        {/* Parent tabs */}
        <div className="flex px-2">
          <TabButton
            active={tab === "requested"}
            onClick={() => selectTab("requested")}
            label={t("tabRequested")}
            badge={newCount > 0 ? newCount : undefined}
          />
          <TabButton
            active={tab === "active"}
            onClick={() => selectTab("active")}
            label={t("tabActive")}
            badge={activeCount > 0 ? activeCount : undefined}
            dot={tab !== "requested" && hasNewSinceView}
          />
          <TabButton
            active={tab === "done"}
            onClick={() => selectTab("done")}
            label={t("tabDone")}
          />
        </div>
      </header>

      {/* Active sub-tabs */}
      {tab === "active" && (
        <div className="flex gap-2 px-4 pt-3">
          <SubTab
            active={sub === "todo"}
            onClick={() => setSub("todo")}
            label={t("subTodo")}
            count={todoCount}
          />
          <SubTab
            active={sub === "preparing"}
            onClick={() => setSub("preparing")}
            label={t("subPreparing")}
            count={preparingCount}
          />
        </div>
      )}

      {/* Search by order id */}
      <div className="p-4 pb-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
          <Input
            inputMode="numeric"
            placeholder={t("searchOrder")}
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
            <p className="mt-3 font-medium">{t(emptyKey)}</p>
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
      className={`relative flex-1 border-b-2 px-2 py-2.5 text-sm font-semibold transition-colors ${
        active ? "border-white text-white" : "border-transparent text-white/70"
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

function SubTab({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
        active
          ? "bg-brand-secondary text-white shadow-sm"
          : "bg-gray-200 text-gray-700 active:bg-gray-300"
      }`}
    >
      {label}
      {count > 0 && (
        <span
          className={`ml-1.5 inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold ${
            active ? "bg-white/25 text-white" : "bg-white text-gray-700"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
