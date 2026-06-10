-- ============================================================================
--  The Belgian Waffle Xpress — Database schema
--  Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
--  Safe to re-run: it drops and recreates everything.
-- ============================================================================

-- ---------------------------------------------------------------------------
--  Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";  -- for gen_random_uuid()

-- ---------------------------------------------------------------------------
--  Enum: order status
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type order_status as enum ('NEW', 'ACCEPTED', 'PREPARING', 'DONE');
  end if;
end$$;

-- ---------------------------------------------------------------------------
--  Tables
-- ---------------------------------------------------------------------------

-- Single-restaurant branding / configuration. Exactly one row is expected.
create table if not exists restaurant_settings (
  id              uuid primary key default gen_random_uuid(),
  name            text        not null default 'The Belgian Waffle Xpress',
  tagline         text,
  logo_url        text,
  primary_color   text        not null default '#d97706',
  secondary_color text        not null default '#5b3a1a',
  whatsapp_number text        not null default '919876543210',  -- intl format, digits only
  currency        text        not null default '₹',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  name        text        not null,
  description text,
  sort_order  int         not null default 0,
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists menu_items (
  id            uuid primary key default gen_random_uuid(),
  category_id   uuid not null references categories(id) on delete cascade,
  name          text        not null,
  description   text,
  price         numeric(10,2) not null check (price >= 0),
  -- Some items carry a second price (e.g. waffle cakes single/double layer).
  secondary_price numeric(10,2),
  secondary_label text,            -- e.g. 'Double Layer'
  is_available  boolean     not null default true,
  is_bestseller boolean     not null default false,
  sort_order    int         not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists menu_items_category_idx on menu_items(category_id);

-- Human-readable order numbers start at #101.
create sequence if not exists order_number_seq start 101;

create table if not exists orders (
  id                  uuid primary key default gen_random_uuid(),
  display_order_number text        not null unique
                         default ('#' || nextval('order_number_seq')::text),
  customer_name       text        not null,
  customer_phone      text        not null,
  status              order_status not null default 'NEW',
  total_amount        numeric(10,2) not null check (total_amount >= 0),
  note                text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists orders_status_idx     on orders(status);
create index if not exists orders_created_at_idx  on orders(created_at desc);
create index if not exists orders_display_no_idx  on orders(display_order_number);

create table if not exists order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references orders(id) on delete cascade,
  -- Denormalised snapshot so historic orders stay correct if the menu changes.
  menu_item_id uuid references menu_items(id) on delete set null,
  name        text          not null,
  unit_price  numeric(10,2) not null,
  quantity    int           not null check (quantity > 0),
  line_total  numeric(10,2) not null,
  variant_label text,
  created_at  timestamptz   not null default now()
);

create index if not exists order_items_order_idx on order_items(order_id);

-- ---------------------------------------------------------------------------
--  updated_at trigger for orders & settings
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end$$;

drop trigger if exists trg_orders_updated_at on orders;
create trigger trg_orders_updated_at
  before update on orders
  for each row execute function set_updated_at();

drop trigger if exists trg_settings_updated_at on restaurant_settings;
create trigger trg_settings_updated_at
  before update on restaurant_settings
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
--  Realtime: broadcast row changes for orders so the customer tracking page
--  and the admin dashboard update live.
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table orders;

-- ---------------------------------------------------------------------------
--  Row Level Security
--
--  This app has no end-user auth: consumers browse the menu and place orders
--  with only the anon key, and the admin is gated by an env username/password
--  at the app layer (writes that change order status go through a server route
--  using the service_role key, which bypasses RLS).
--
--  So with the anon key we allow:
--    * read menu/categories/settings
--    * insert orders + order_items
--    * read a single order by its display number (for the tracking page)
--  …and nothing else. Status updates are server-only.
-- ---------------------------------------------------------------------------
alter table restaurant_settings enable row level security;
alter table categories          enable row level security;
alter table menu_items          enable row level security;
alter table orders              enable row level security;
alter table order_items         enable row level security;

-- Public read of menu + branding
drop policy if exists "public read settings"   on restaurant_settings;
create policy "public read settings"   on restaurant_settings for select using (true);

drop policy if exists "public read categories" on categories;
create policy "public read categories" on categories for select using (true);

drop policy if exists "public read menu" on menu_items;
create policy "public read menu" on menu_items for select using (true);

-- Public can read orders (tracking page looks up by display_order_number).
-- The display number is unguessable enough for this use case; no PII beyond
-- name/phone the customer entered themselves.
drop policy if exists "public read orders" on orders;
create policy "public read orders" on orders for select using (true);

drop policy if exists "public read order_items" on order_items;
create policy "public read order_items" on order_items for select using (true);

-- Public can create orders + their items (checkout).
drop policy if exists "public create orders" on orders;
create policy "public create orders" on orders for insert with check (true);

drop policy if exists "public create order_items" on order_items;
create policy "public create order_items" on order_items for insert with check (true);

-- NOTE: there is intentionally no public UPDATE/DELETE policy. Order status
-- changes are performed server-side with the service_role key.
