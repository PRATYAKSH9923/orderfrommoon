"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CustomerProfile {
  name: string;
  phone: string;
}

interface CustomerState {
  profile: CustomerProfile | null;
  save: (profile: CustomerProfile) => void;
  clear: () => void;
}

/**
 * Remembers the customer's name + mobile in localStorage so checkout is
 * pre-filled next time, and so "My Orders" can look up their history by phone.
 */
export const useCustomer = create<CustomerState>()(
  persist(
    (set) => ({
      profile: null,
      save: (profile) => set({ profile }),
      clear: () => set({ profile: null }),
    }),
    { name: "bwx-customer" }
  )
);
