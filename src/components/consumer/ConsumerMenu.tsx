"use client";

import { useMemo, useRef, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { CategoryWithItems, CartItem, RestaurantSettings } from "@/types";
import { useCart } from "@/store/cart";
import { useCustomer } from "@/store/customer";
import { useLang } from "@/components/LanguageProvider";
import { formatPrice } from "@/lib/utils";
import { publicEnv } from "@/lib/env";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { ConsumerHeader } from "./ConsumerHeader";
import { CategorySection } from "./CategorySection";
import { CartSheet } from "./CartSheet";
import { CheckoutModal } from "./CheckoutModal";
import { OrderReviewModal } from "./OrderReviewModal";
import { OrderConfirmationModal } from "./OrderConfirmationModal";
import { MenuJumpButton } from "./MenuJumpButton";

interface ConsumerMenuProps {
  menu: CategoryWithItems[];
  banners: Record<string, string[]>;
  settings: RestaurantSettings | null;
}

type ConfirmedOrder = {
  orderNumber: string;
  items: CartItem[];
  total: number;
  customerName: string;
  customerPhone: string;
};

// Checkout steps: details → review → (placed = confirmed set)
type Step = "none" | "details" | "review";

export function ConsumerMenu({ menu, banners, settings }: ConsumerMenuProps) {
  const { t } = useLang();
  const currency = settings?.currency ?? "₹";
  const restaurantName = settings?.name ?? publicEnv.restaurantName;
  const whatsappNumber =
    settings?.whatsapp_number || publicEnv.restaurantWhatsApp;

  const items = useCart((s) => s.items);
  const count = useCart((s) => s.count());
  const total = useCart((s) => s.total());
  const clear = useCart((s) => s.clear);
  const saveCustomer = useCustomer((s) => s.save);

  const [query, setQuery] = useState("");
  // All sections open by default; track which the user has collapsed.
  const [closedIds, setClosedIds] = useState<Set<string>>(new Set());
  const [cartOpen, setCartOpen] = useState(false);
  const [step, setStep] = useState<Step>("none");
  const [details, setDetails] = useState<{ name: string; phone: string } | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<ConfirmedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const searching = query.trim().length > 0;

  const filteredMenu = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return menu;
    return menu
      .map((c) => ({
        ...c,
        items: c.items.filter(
          (i) =>
            i.name.toLowerCase().includes(q) ||
            (i.description?.toLowerCase().includes(q) ?? false)
        ),
      }))
      .filter((c) => c.items.length > 0);
  }, [menu, query]);

  const toggleSection = (id: string) => {
    setClosedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const jumpTo = (id: string) => {
    // Ensure the target section is open, then scroll to it.
    setClosedIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setTimeout(() => {
      sectionRefs.current[id]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 60);
  };

  // Step 1 → 2: collect details, advance to review (does NOT place the order).
  const handleDetails = (data: { name: string; phone: string }) => {
    setDetails(data);
    setStep("review");
  };

  // Step 2 → place: only now is the order actually saved. The customer may have
  // corrected their name/phone on the review screen, so use those values.
  const handleConfirm = async (edited: { name: string; phone: string }) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: edited.name,
          customer_phone: edited.phone,
          items: items.map((i) => ({
            menu_item_id: i.menuItemId,
            name: i.name,
            unit_price: i.price,
            quantity: i.quantity,
            variant_label: i.variantLabel,
          })),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? t("somethingWrong"));
      }
      const { order } = await res.json();

      // Remember the (corrected) customer for next time + history lookup.
      saveCustomer({ name: edited.name, phone: edited.phone });

      setConfirmed({
        orderNumber: order.display_order_number,
        items: [...items],
        total,
        customerName: edited.name,
        customerPhone: edited.phone,
      });
      clear();
      setStep("none");
      setCartOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("somethingWrong"));
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappUrl = confirmed
    ? buildWhatsAppUrl(
        whatsappNumber,
        buildWhatsAppMessage({
          restaurantName,
          orderNumber: confirmed.orderNumber,
          items: confirmed.items,
          total: confirmed.total,
          customerName: confirmed.customerName,
          customerPhone: confirmed.customerPhone,
          currency,
        })
      )
    : "";

  return (
    <div className="flex min-h-dvh flex-col bg-gray-50">
      <ConsumerHeader
        restaurantName={restaurantName}
        tagline={settings?.tagline}
        query={query}
        onQueryChange={setQuery}
      />

      <main className="flex-1 space-y-3 px-3 pb-28 pt-3">
        {filteredMenu.length === 0 ? (
          <p className="py-16 text-center text-gray-500">
            {t("noResults")}
            {query ? ` — “${query}”` : ""}
          </p>
        ) : (
          filteredMenu.map((category) => (
            <div
              key={category.id}
              ref={(el) => {
                sectionRefs.current[category.id] = el;
              }}
              className="scroll-mt-32"
            >
              <CategorySection
                category={category}
                banners={banners[category.id] ?? []}
                currency={currency}
                open={!closedIds.has(category.id)}
                forcedOpen={searching}
                onToggle={() => toggleSection(category.id)}
              />
            </div>
          ))
        )}
      </main>

      {/* Floating MENU jump button (hidden while searching) */}
      {!searching && filteredMenu.length > 0 && !confirmed && (
        <MenuJumpButton
          categories={filteredMenu.map((c) => ({
            id: c.id,
            name: c.name,
            count: c.items.length,
          }))}
          onJump={jumpTo}
          raised={count > 0}
        />
      )}

      {/* Sticky cart bar */}
      {count > 0 && !confirmed && (
        <div className="fixed inset-x-0 bottom-0 z-30 p-3 safe-bottom">
          <button
            onClick={() => setCartOpen(true)}
            className="mx-auto flex w-full max-w-md items-center justify-between rounded-2xl bg-brand px-5 py-3.5 pr-20 text-brand-contrast shadow-xl transition-active active:scale-[0.99]"
          >
            <span className="flex items-center gap-2 font-bold">
              <span className="relative">
                <ShoppingCart className="size-6" />
                <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-white text-xs font-bold text-brand">
                  {count}
                </span>
              </span>
              {t("viewCart")}
            </span>
            <span className="font-extrabold">{formatPrice(total, currency)}</span>
          </button>
        </div>
      )}

      <CartSheet
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false);
          setStep("details");
        }}
        currency={currency}
      />

      <CheckoutModal
        isOpen={step === "details"}
        totalAmount={total}
        currency={currency}
        onClose={() => setStep("none")}
        onSubmit={handleDetails}
      />

      {details && (
        <OrderReviewModal
          key={`${details.name}|${details.phone}`}
          isOpen={step === "review"}
          items={items}
          total={total}
          currency={currency}
          customerName={details.name}
          customerPhone={details.phone}
          loading={submitting}
          onConfirm={handleConfirm}
          onBack={() => !submitting && setStep("details")}
        />
      )}

      {confirmed && (
        <OrderConfirmationModal
          isOpen={!!confirmed}
          orderNumber={confirmed.orderNumber}
          items={confirmed.items}
          total={confirmed.total}
          customerName={confirmed.customerName}
          customerPhone={confirmed.customerPhone}
          whatsappUrl={whatsappUrl}
          currency={currency}
          restaurantName={restaurantName}
        />
      )}

      {error && (
        <div className="fixed inset-x-0 bottom-24 z-40 mx-auto max-w-md px-4">
          <div className="rounded-xl bg-red-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg">
            {error}
          </div>
        </div>
      )}
    </div>
  );
}
