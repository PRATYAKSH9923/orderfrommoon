"use client";

import { useMemo, useRef, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { CategoryWithItems, CartItem, RestaurantSettings } from "@/types";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { publicEnv } from "@/lib/env";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { ConsumerHeader } from "./ConsumerHeader";
import { CategoryNav } from "./CategoryNav";
import { MenuItemCard } from "./MenuItemCard";
import { CartSheet } from "./CartSheet";
import { CheckoutModal } from "./CheckoutModal";
import { OrderConfirmationModal } from "./OrderConfirmationModal";

interface ConsumerMenuProps {
  menu: CategoryWithItems[];
  settings: RestaurantSettings | null;
}

type ConfirmedOrder = {
  orderNumber: string;
  items: CartItem[];
  total: number;
  customerName: string;
  customerPhone: string;
};

export function ConsumerMenu({ menu, settings }: ConsumerMenuProps) {
  const currency = settings?.currency ?? "₹";
  const restaurantName = settings?.name ?? publicEnv.restaurantName;
  const whatsappNumber =
    settings?.whatsapp_number || publicEnv.restaurantWhatsApp;

  const items = useCart((s) => s.items);
  const count = useCart((s) => s.count());
  const total = useCart((s) => s.total());
  const clear = useCart((s) => s.clear);

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(
    menu[0]?.id ?? null
  );
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<ConfirmedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Filter by search across all categories.
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

  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    sectionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleCheckout = async (data: { name: string; phone: string }) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: data.name,
          customer_phone: data.phone,
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
        throw new Error(body.error ?? "Failed to place order");
      }
      const { order } = await res.json();

      // Snapshot the cart for the confirmation modal, then clear it.
      setConfirmed({
        orderNumber: order.display_order_number,
        items: [...items],
        total,
        customerName: data.name,
        customerPhone: data.phone,
      });
      clear();
      setCheckoutOpen(false);
      setCartOpen(false);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Something went wrong. Please retry."
      );
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

      {!query && filteredMenu.length > 1 && (
        <CategoryNav
          categories={filteredMenu.map((c) => ({ id: c.id, name: c.name }))}
          activeId={activeCategory}
          onSelect={scrollToCategory}
        />
      )}

      <main className="flex-1 px-4 pb-28 pt-2">
        {filteredMenu.length === 0 ? (
          <p className="py-16 text-center text-gray-500">
            No items found for “{query}”.
            <br />
            कोई आइटम नहीं मिला · ਕੋਈ ਆਈਟਮ ਨਹੀਂ ਮਿਲੀ
          </p>
        ) : (
          filteredMenu.map((category) => (
            <section
              key={category.id}
              ref={(el) => {
                sectionRefs.current[category.id] = el;
              }}
              className="scroll-mt-36 pt-4"
            >
              <div className="mb-1 flex items-baseline justify-between">
                <h2 className="text-lg font-extrabold text-gray-900">
                  {category.name}
                </h2>
                <span className="text-xs text-gray-400">
                  {category.items.length} items
                </span>
              </div>
              {category.description && (
                <p className="mb-1 text-xs text-gray-400">
                  {category.description}
                </p>
              )}
              <div className="divide-y divide-gray-100 rounded-2xl bg-white px-4 shadow-sm">
                {category.items.map((item) => (
                  <MenuItemCard key={item.id} item={item} currency={currency} />
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      {/* Sticky cart bar */}
      {count > 0 && !confirmed && (
        <div className="fixed inset-x-0 bottom-0 z-30 p-3 safe-bottom">
          <button
            onClick={() => setCartOpen(true)}
            className="mx-auto flex w-full max-w-md items-center justify-between rounded-2xl bg-brand px-5 py-3.5 text-brand-contrast shadow-lg active:scale-[0.99] transition-active"
          >
            <span className="flex items-center gap-2 font-bold">
              <span className="relative">
                <ShoppingCart className="size-6" />
                <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-white text-xs font-bold text-brand">
                  {count}
                </span>
              </span>
              View Cart
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
          setCheckoutOpen(true);
        }}
        currency={currency}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        totalAmount={total}
        currency={currency}
        loading={submitting}
        onClose={() => !submitting && setCheckoutOpen(false)}
        onSubmit={handleCheckout}
      />

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
