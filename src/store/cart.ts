"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, MenuItem } from "@/types";

interface CartState {
  items: CartItem[];
  addItem: (
    item: MenuItem,
    variant?: { label: string; price: number }
  ) => void;
  increase: (lineId: string) => void;
  decrease: (lineId: string) => void;
  removeItem: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
  // derived helpers
  count: () => number;
  total: () => number;
  quantityOf: (menuItemId: string) => number;
}

/** Build a stable line id from a menu item + optional variant. */
function lineIdFor(menuItemId: string, variantLabel?: string): string {
  return variantLabel ? `${menuItemId}::${variantLabel}` : menuItemId;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, variant) => {
        const variantLabel = variant?.label;
        const price = variant?.price ?? item.price;
        const id = lineIdFor(item.id, variantLabel);
        set((state) => {
          const existing = state.items.find((i) => i.id === id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                id,
                menuItemId: item.id,
                name: item.name,
                price,
                quantity: 1,
                variantLabel,
              },
            ],
          };
        });
      },

      increase: (lineId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === lineId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        })),

      decrease: (lineId) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.id === lineId ? { ...i, quantity: i.quantity - 1 } : i
            )
            .filter((i) => i.quantity > 0),
        })),

      setQuantity: (lineId, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.id === lineId ? { ...i, quantity } : i))
            .filter((i) => i.quantity > 0),
        })),

      removeItem: (lineId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== lineId),
        })),

      clear: () => set({ items: [] }),

      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      total: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      quantityOf: (menuItemId) =>
        get()
          .items.filter((i) => i.menuItemId === menuItemId)
          .reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "bwx-cart",
      // Persist only the items array.
      partialize: (state) => ({ items: state.items }),
    }
  )
);
