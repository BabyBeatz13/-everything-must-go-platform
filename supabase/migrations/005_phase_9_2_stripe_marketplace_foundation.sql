-- Phase 9.2: Stripe payments, commission, and seller payout foundation

-- Seller Stripe Connect status fields
alter table public.seller_profiles
  add column if not exists stripe_account_id text,
  add column if not exists stripe_onboarding_complete boolean not null default false,
  add column if not exists stripe_charges_enabled boolean not null default false,
  add column if not exists stripe_payouts_enabled boolean not null default false,
  add column if not exists stripe_details_submitted boolean not null default false;

create index if not exists idx_seller_profiles_stripe_account_id on public.seller_profiles(stripe_account_id);

-- Orders: Stripe/payment tracking and cents-based accounting
alter table public.orders
  add column if not exists stripe_checkout_session_id text,
  add column if not exists stripe_payment_intent_id text,
  add column if not exists paid_at timestamptz,
  add column if not exists subtotal_cents bigint not null default 0,
  add column if not exists shipping_total_cents bigint not null default 0,
  add column if not exists tax_total_cents bigint not null default 0,
  add column if not exists platform_fee_cents bigint not null default 0,
  add column if not exists grand_total_cents bigint not null default 0,
  add column if not exists currency text not null default 'usd';

create index if not exists idx_orders_stripe_checkout_session_id on public.orders(stripe_checkout_session_id);
create index if not exists idx_orders_stripe_payment_intent_id on public.orders(stripe_payment_intent_id);

alter table public.order_items
  add column if not exists unit_price_cents bigint not null default 0,
  add column if not exists shipping_amount_cents bigint not null default 0,
  add column if not exists platform_commission_cents bigint not null default 0,
  add column if not exists seller_earnings_cents bigint not null default 0,
  add column if not exists refunded_amount_cents bigint not null default 0,
  add column if not exists refund_status text not null default 'none' check (refund_status in ('none', 'partial', 'full'));

-- Stripe webhook idempotency and payment records
create table if not exists public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  stripe_event_id text not null unique,
  event_type text not null,
  payload jsonb not null,
  processed boolean not null default false,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Platform fees
create table if not exists public.platform_fees (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  order_item_id uuid references public.order_items(id) on delete set null,
  seller_id uuid references public.seller_profiles(id) on delete set null,
  fee_amount_cents bigint not null default 0,
  fee_type text not null default 'commission' check (fee_type in ('commission', 'refund_adjustment', 'dispute_adjustment')),
  currency text not null default 'usd',
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_platform_fees_order_id on public.platform_fees(order_id);
create index if not exists idx_platform_fees_seller_id on public.platform_fees(seller_id);

-- Seller earnings ledger
create table if not exists public.seller_earnings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.seller_profiles(id) on delete cascade,
  order_id uuid not null references public.orders(id) on delete cascade,
  order_item_id uuid references public.order_items(id) on delete set null,
  gross_sales_cents bigint not null default 0,
  shipping_cents bigint not null default 0,
  platform_fee_cents bigint not null default 0,
  seller_net_cents bigint not null default 0,
  currency text not null default 'usd',
  earning_status text not null default 'pending' check (earning_status in ('pending', 'available', 'transferred', 'refunded', 'cancelled')),
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (seller_id, order_id, order_item_id)
);

create index if not exists idx_seller_earnings_seller_id on public.seller_earnings(seller_id);
create index if not exists idx_seller_earnings_order_id on public.seller_earnings(order_id);

-- Seller transfer records
create table if not exists public.seller_transfers (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.seller_profiles(id) on delete cascade,
  order_id uuid not null references public.orders(id) on delete cascade,
  stripe_transfer_id text,
  gross_sales_cents bigint not null default 0,
  platform_fee_cents bigint not null default 0,
  seller_amount_cents bigint not null default 0,
  currency text not null default 'usd',
  transfer_status text not null default 'pending' check (transfer_status in ('pending', 'completed', 'failed', 'reversed', 'cancelled')),
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (seller_id, order_id)
);

create index if not exists idx_seller_transfers_seller_id on public.seller_transfers(seller_id);
create index if not exists idx_seller_transfers_order_id on public.seller_transfers(order_id);

-- Refund ledger foundation
create table if not exists public.refunds (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  order_item_id uuid references public.order_items(id) on delete set null,
  seller_id uuid references public.seller_profiles(id) on delete set null,
  stripe_refund_id text,
  stripe_charge_id text,
  refund_amount_cents bigint not null default 0,
  currency text not null default 'usd',
  refund_scope text not null default 'full' check (refund_scope in ('full', 'partial', 'item')),
  refund_status text not null default 'pending' check (refund_status in ('pending', 'succeeded', 'failed', 'cancelled')),
  initiated_by uuid references public.profiles(id) on delete set null,
  reason text,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_refunds_order_id on public.refunds(order_id);
create index if not exists idx_refunds_seller_id on public.refunds(seller_id);
create index if not exists idx_refunds_stripe_refund_id on public.refunds(stripe_refund_id);

-- RLS
alter table public.webhook_events enable row level security;
alter table public.platform_fees enable row level security;
alter table public.seller_earnings enable row level security;
alter table public.seller_transfers enable row level security;
alter table public.refunds enable row level security;

create or replace function public.decrement_marketplace_inventory(
  p_product_id uuid,
  p_quantity integer
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_count integer;
begin
  update public.marketplace_products
  set inventory_quantity = inventory_quantity - p_quantity,
      updated_at = now()
  where id = p_product_id
    and inventory_quantity >= p_quantity;

  get diagnostics updated_count = row_count;
  return updated_count = 1;
end;
$$;

revoke all on function public.decrement_marketplace_inventory(uuid, integer) from public;
grant execute on function public.decrement_marketplace_inventory(uuid, integer) to authenticated, service_role;

create policy seller_profiles_owner_read on public.seller_profiles
  for select using (auth.uid() = profile_id);

create policy seller_profiles_admin_read on public.seller_profiles
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Seller can read only their own earnings/transfers
create policy seller_earnings_select_own on public.seller_earnings
  for select using (
    exists (
      select 1 from public.seller_profiles sp
      where sp.id = seller_earnings.seller_id and sp.profile_id = auth.uid()
    )
  );

create policy seller_transfers_select_own on public.seller_transfers
  for select using (
    exists (
      select 1 from public.seller_profiles sp
      where sp.id = seller_transfers.seller_id and sp.profile_id = auth.uid()
    )
  );

-- Seller can read only refunds connected to their own records
create policy refunds_seller_select_own on public.refunds
  for select using (
    exists (
      select 1 from public.seller_profiles sp
      where sp.id = refunds.seller_id and sp.profile_id = auth.uid()
    )
  );

-- Customer can read only refunds connected to their own orders
create policy refunds_customer_select_own on public.refunds
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = refunds.order_id and o.customer_id = auth.uid()
    )
  );

-- Admin read access for finance tables
create policy webhook_events_admin_read on public.webhook_events
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy platform_fees_admin_read on public.platform_fees
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy seller_earnings_admin_read on public.seller_earnings
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy seller_transfers_admin_read on public.seller_transfers
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy refunds_admin_read on public.refunds
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Seller order-item visibility: seller can see only their own order items
create policy order_items_seller_select_own on public.order_items
  for select using (
    exists (
      select 1 from public.seller_profiles sp
      where sp.id = order_items.seller_id and sp.profile_id = auth.uid()
    )
  );

-- Admin order visibility
create policy orders_admin_select on public.orders
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy order_items_admin_select on public.order_items
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );
