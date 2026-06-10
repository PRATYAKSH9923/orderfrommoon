// ============================================================================
//  Domain types — shared across consumer & admin.
//  Column names mirror the Supabase schema (see supabase/schema.sql).
// ============================================================================

export type OrderStatus = "NEW" | "ACCEPTED" | "PREPARING" | "DONE";

export const ORDER_STATUSES: OrderStatus[] = [
  "NEW",
  "ACCEPTED",
  "PREPARING",
  "DONE",
];

export interface RestaurantSettings {
  id: string;
  name: string;
  tagline: string | null;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  whatsapp_number: string;
  currency: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  secondary_price: number | null;
  secondary_label: string | null;
  is_available: boolean;
  is_bestseller: boolean;
  sort_order: number;
}

/** A menu item grouped under its category — used to render the menu. */
export interface CategoryWithItems extends Category {
  items: MenuItem[];
}

/** An item as held in the cart (client-side, Zustand). */
export interface CartItem {
  /** Unique line id = menu item id (+ variant when applicable). */
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  variantLabel?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
  variant_label: string | null;
}

export interface Order {
  id: string;
  display_order_number: string; // e.g. "#101"
  customer_name: string;
  customer_phone: string;
  status: OrderStatus;
  total_amount: number;
  note: string | null;
  created_at: string; // ISO timestamp
  updated_at: string;
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

/** Payload posted from the consumer checkout to create an order. */
export interface CreateOrderPayload {
  customer_name: string;
  customer_phone: string;
  note?: string;
  items: {
    menu_item_id: string;
    name: string;
    unit_price: number;
    quantity: number;
    variant_label?: string;
  }[];
}
