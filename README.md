# The Belgian Waffle Xpress — Ordering App 🧇

A production-ready, **mobile-first** restaurant ordering PWA. Built for restaurant
staff on Android phones and for customers ordering from the printed menu.

- **Consumer**: browse the full waffle menu, add to cart, checkout (name + mobile,
  no payment), confirm on WhatsApp, and track the order live.
- **Admin**: log in (env credentials), see orders update in realtime, and move them
  through New → Accepted → Preparing → Done.

Stack: **Next.js 16 (App Router)** · TypeScript · Tailwind CSS v4 · Supabase
(Postgres + Realtime) · Zustand · Lucide Icons · PWA.

---

## 🚀 Quick start

1. **Create the database** — follow [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md).
   It walks you through making a free Supabase project, where to copy the URL +
   keys, and running `supabase/schema.sql` + `supabase/seed.sql`.
2. **Configure env** — copy `.env.example` to `.env.local` and fill in the values
   (Supabase URL/keys + admin username/password).
3. **Install & run**:
   ```bash
   npm install
   npm run dev
   ```
   Open <http://localhost:3000>.

---

## 🗂️ Folder structure

```
app/                              # Next.js App Router (routes only)
  layout.tsx                      # Root layout: fonts, metadata, brand, SW register
  page.tsx                        # Landing page (Consumer / Admin cards)
  consumer/page.tsx               # Menu (server-fetched) -> <ConsumerMenu>
  order/[orderNumber]/page.tsx    # Live order tracking
  admin/page.tsx                  # Admin login
  admin/dashboard/page.tsx        # Admin dashboard (auth-protected)
  api/
    orders/route.ts               # POST create order (server-priced)
    admin/login/route.ts          # POST admin login
    admin/logout/route.ts         # POST admin logout
    admin/orders/[id]/status/...  # PATCH order status (admin only)

src/
  components/
    ui/                           # Button, Input, Card, Modal, StatusBadge, ...
    consumer/                     # Header, MenuItemCard, CartSheet, Checkout,
                                  #   OrderConfirmation (WhatsApp countdown), Tracker
    admin/                        # AdminLogin, AdminDashboard, AdminOrderCard
    BrandProvider.tsx             # Applies DB branding colours -> CSS vars
    ServiceWorkerRegistrar.tsx
  lib/
    supabase/{client,server}.ts   # Browser (anon) & server (service-role) clients
    queries.ts                    # Menu / settings / orders data access
    admin-auth.ts                 # Signed-cookie admin session (no user mgmt)
    whatsapp.ts                   # Trilingual WhatsApp message + wa.me link
    i18n.ts                       # English / Hindi / Punjabi strings
    env.ts, utils.ts
  store/cart.ts                   # Zustand cart (localStorage persisted)
  types/index.ts                  # Shared domain types

supabase/
  schema.sql                      # Tables, enum, sequence, RLS, realtime
  seed.sql                        # Full menu + branding (from the menu cards)

public/
  manifest.json, service-worker.js, offline.html, icon-*.png
scripts/generate-icons.mjs        # Regenerate PWA icons
```

---

## 🗄️ Database

Tables (UUID primary keys, never exposed to users):

| Table                 | Purpose                                              |
| --------------------- | ---------------------------------------------------- |
| `restaurant_settings` | Single-row branding: name, colours, WhatsApp number  |
| `categories`          | Menu categories (The OGs, Bubble Waffles, ...)       |
| `menu_items`          | Items with price (+ optional single/double variant)  |
| `orders`              | `display_order_number` (#101, #102...), status, total|
| `order_items`         | Line items (price snapshot per order)                |

- **Human-readable order numbers** come from a Postgres sequence starting at
  `#101`. UUIDs are internal only.
- **Statuses**: `NEW → ACCEPTED → PREPARING → DONE` (enum `order_status`).
- **Realtime**: the `orders` table is in the `supabase_realtime` publication, so
  status changes push instantly to the customer tracking page and the dashboard.
- **RLS**: anon key can read the menu/settings, create orders, and read an order
  by number. Status changes are **server-only** (service-role key behind the
  admin session) — the client can never change an order's status.

---

## ✨ Key features

- **No images, by design** — the menu is replicated as fast text cards using the
  restaurant's brand colours (amber/brown), matching the printed menu.
- **WhatsApp confirmation flow** — after an order is saved, tapping *Confirm on
  WhatsApp* starts a **10 → 0 countdown** with a trilingual message ("your order
  is already placed, just confirm by sending the order number"). At 0, WhatsApp
  opens automatically with a pre-filled message (restaurant, order #, items,
  quantities, total, customer name + mobile). *Open Now* skips the wait.
- **Trilingual** — English / Hindi / Punjabi throughout customer-facing copy.
- **Server-side pricing** — order totals are recomputed from the DB so the client
  can't tamper with prices.
- **Admin realtime + new-order dot** — new orders appear live; a red dot/badge
  flags new arrivals.
- **Today's order history** — the Completed tab shows today's done orders (time is
  shown on every order everywhere).
- **PWA** — installable on Android, with an offline shell.

---

## 🔐 Environment variables

See [`.env.example`](./.env.example). Summary:

| Variable                            | Where         | Notes                            |
| ----------------------------------- | ------------- | -------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`          | client+server | Supabase project URL             |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`     | client+server | Public anon key (RLS-protected)  |
| `SUPABASE_SERVICE_ROLE_KEY`         | **server**    | Secret — admin writes only       |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | **server**    | Admin login                      |
| `ADMIN_SESSION_SECRET`              | **server**    | Signs the admin cookie           |
| `NEXT_PUBLIC_RESTAURANT_*`          | client        | Fallbacks before DB settings load|

> The live restaurant name, colours, and WhatsApp number come from the
> `restaurant_settings` table. The `NEXT_PUBLIC_*` values are only fallbacks.

---

## 🛠️ Scripts

```bash
npm run dev      # Dev server (Turbopack)
npm run build    # Production build
npm run start    # Run the production build
npm run lint     # ESLint
node scripts/generate-icons.mjs   # Regenerate PWA icons
```

---

## ☁️ Deploy to Vercel

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for the full guide. In short:

1. Push to GitHub.
2. Import the repo into Vercel.
3. Add the same env vars from `.env.local` to the Vercel project settings.
4. Deploy. (No build config needed — Vercel auto-detects Next.js.)

After deploy, set the real WhatsApp number in `restaurant_settings`.
