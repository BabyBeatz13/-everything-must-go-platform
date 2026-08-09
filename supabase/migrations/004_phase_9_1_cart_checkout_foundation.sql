-- Phase 9.1: shopping cart + checkout foundation for marketplace products

create extension if not exists pgcrypto;

-- Saved customer shipping addresses
create table if not exists public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'US',
  phone text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Cart fields prepared for marketplace products (multi-seller)
alter table public.carts
  add column if not exists status text not null default 'active' check (status in ('active', 'saved', 'converted', 'abandoned')),
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.cart_items
  add column if not exists marketplace_product_id uuid references public.marketplace_products(id) on delete cascade,
  add column if not exists seller_id uuid references public.seller_profiles(id) on delete set null,
  add column if not exists unit_price numeric(12,2) not null default 0,
  add column if not exists shipping_price numeric(12,2) not null default 0,
  add column if not exists product_title_snapshot text,
  add column if not exists product_image_snapshot text,
  add column if not exists store_name_snapshot text,
  add column if not exists condition_snapshot text,
  add column if not exists updated_at timestamptz not null default now();

-- Keep backwards compatibility with the old product_id while making marketplace_product_id the active key.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'cart_items' and column_name = 'product_id'
  ) then
    update public.cart_items
    set marketplace_product_id = product_id
    where marketplace_product_id is null;
  end if;
end $$;

alter table public.cart_items
  alter column marketplace_product_id set not null;

alter table public.cart_items
  drop constraint if exists cart_items_cart_id_product_id_key;

alter table public.cart_items
  add constraint cart_items_cart_id_marketplace_product_id_key unique (cart_id, marketplace_product_id);

create index if not exists idx_customer_addresses_profile_id on public.customer_addresses(profile_id);
create index if not exists idx_customer_addresses_default on public.customer_addresses(profile_id, is_default);
create index if not exists idx_cart_items_marketplace_product_id on public.cart_items(marketplace_product_id);
create index if not exists idx_cart_items_seller_id on public.cart_items(seller_id);

-- Order foundation for payment and fulfillment phases
alter table public.orders
  add column if not exists order_number text unique,
  add column if not exists subtotal numeric(12,2) not null default 0,
  add column if not exists shipping_total numeric(12,2) not null default 0,
  add column if not exists tax_total numeric(12,2) not null default 0,
  add column if not exists platform_fee numeric(12,2) not null default 0,
  add column if not exists grand_total numeric(12,2) not null default 0,
  add column if not exists payment_status text not null default 'pending_payment' check (payment_status in ('pending_payment', 'paid', 'failed', 'refunded', 'partially_refunded')),
  add column if not exists fulfillment_status text not null default 'pending_payment' check (fulfillment_status in ('pending_payment', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'partially_refunded')),
  add column if not exists shipping_address_snapshot jsonb,
  add column if not exists billing_address_snapshot jsonb;

alter table public.orders
  drop constraint if exists orders_status_check;

alter table public.orders
  add constraint orders_status_check check (status in ('pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'partially_refunded'));

alter table public.orders
  alter column status set default 'pending_payment';

update public.orders
set status = 'pending_payment'
where status = 'pending';

update public.orders
set status = 'processing'
where status not in ('pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'partially_refunded');

update public.orders
set order_number = concat('EMG-', upper(substr(replace(id::text, '-', ''), 1, 12)))
where order_number is null;

alter table public.order_items
  add column if not exists seller_id uuid references public.seller_profiles(id) on delete set null,
  add column if not exists product_title_snapshot text,
  add column if not exists shipping_amount numeric(12,2) not null default 0,
  add column if not exists platform_commission_amount numeric(12,2) not null default 0,
  add column if not exists seller_earnings_amount numeric(12,2) not null default 0,
  add column if not exists fulfillment_status text not null default 'pending_payment' check (fulfillment_status in ('pending_payment', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'partially_refunded')),
  add column if not exists tracking_number text,
  add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_orders_order_number on public.orders(order_number);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_order_items_seller_id on public.order_items(seller_id);

-- RLS enablement
alter table public.customer_addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;

-- Replace limited read-only cart policies with full owner CRUD.
drop policy if exists carts_are_profile_read on public.carts;
drop policy if exists cart_items_are_profile_read on public.cart_items;

create policy carts_customer_select_own on public.carts
  for select using (auth.uid() = profile_id);

create policy carts_customer_insert_own on public.carts
  for insert with check (auth.uid() = profile_id);

create policy carts_customer_update_own on public.carts
  for update using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

create policy carts_customer_delete_own on public.carts
  for delete using (auth.uid() = profile_id);

create policy cart_items_customer_select_own on public.cart_items
  for select using (
    exists (
      select 1
      from public.carts c
      where c.id = cart_items.cart_id and c.profile_id = auth.uid()
    )
  );

create policy cart_items_customer_insert_own on public.cart_items
  for insert with check (
    exists (
      select 1
      from public.carts c
      where c.id = cart_items.cart_id and c.profile_id = auth.uid()
    )
  );

create policy cart_items_customer_update_own on public.cart_items
  for update using (
    exists (
      select 1
      from public.carts c
      where c.id = cart_items.cart_id and c.profile_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.carts c
      where c.id = cart_items.cart_id and c.profile_id = auth.uid()
    )
  );

create policy cart_items_customer_delete_own on public.cart_items
  for delete using (
    exists (
      select 1
      from public.carts c
      where c.id = cart_items.cart_id and c.profile_id = auth.uid()
    )
  );

create policy customer_addresses_select_own on public.customer_addresses
  for select using (auth.uid() = profile_id);

create policy customer_addresses_insert_own on public.customer_addresses
  for insert with check (auth.uid() = profile_id);

create policy customer_addresses_update_own on public.customer_addresses
  for update using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

create policy customer_addresses_delete_own on public.customer_addresses
  for delete using (auth.uid() = profile_id);

-- Replace old order read policy with owner CRUD foundation.
drop policy if exists orders_are_customer_read on public.orders;
drop policy if exists order_items_are_customer_read on public.order_items;

create policy orders_customer_select_own on public.orders
  for select using (auth.uid() = customer_id);

create policy orders_customer_insert_own on public.orders
  for insert with check (auth.uid() = customer_id);

create policy orders_customer_update_own on public.orders
  for update using (auth.uid() = customer_id)
  with check (auth.uid() = customer_id);

create policy orders_customer_delete_own on public.orders
  for delete using (auth.uid() = customer_id);

create policy order_items_customer_select_own on public.order_items
  for select using (
    exists (
      select 1
      from public.orders o
      where o.id = order_items.order_id and o.customer_id = auth.uid()
    )
  );

create policy order_items_customer_insert_own on public.order_items
  for insert with check (
    exists (
      select 1
      from public.orders o
      where o.id = order_items.order_id and o.customer_id = auth.uid()
    )
  );

create policy order_items_customer_update_own on public.order_items
  for update using (
    exists (
      select 1
      from public.orders o
      where o.id = order_items.order_id and o.customer_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.orders o
      where o.id = order_items.order_id and o.customer_id = auth.uid()
    )
  );

create policy order_items_customer_delete_own on public.order_items
  for delete using (
    exists (
      select 1
      from public.orders o
      where o.id = order_items.order_id and o.customer_id = auth.uid()
    )
  );
