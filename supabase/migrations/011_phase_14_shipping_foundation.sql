create table if not exists public.shipping_methods (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references public.seller_profiles(id) on delete cascade,
  name text not null,
  description text,
  price numeric(12,2) not null default 0,
  estimated_min_days integer not null default 3,
  estimated_max_days integer not null default 7,
  active boolean not null default true,
  applicable_categories jsonb not null default '[]'::jsonb,
  free_shipping_threshold numeric(12,2) default null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.seller_shipping_settings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null unique references public.seller_profiles(id) on delete cascade,
  default_handling_time_days integer not null default 2,
  shipping_origin_country text not null default 'US',
  shipping_origin_state text,
  processing_days integer not null default 2,
  weekend_processing_preference boolean not null default false,
  return_address text,
  local_pickup_enabled boolean not null default false,
  free_shipping_threshold numeric(12,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  seller_id uuid references public.seller_profiles(id) on delete set null,
  carrier text,
  service_level text,
  tracking_number text,
  tracking_url text,
  status text not null default 'label_created' check (status in ('label_created', 'pre_transit', 'in_transit', 'out_for_delivery', 'delivered', 'exception', 'delayed', 'returned_to_sender', 'unknown')),
  last_tracking_update timestamptz,
  shipped_at timestamptz,
  estimated_delivery timestamptz,
  delivered_at timestamptz,
  estimated_ship_date timestamptz,
  estimated_delivery_start timestamptz,
  estimated_delivery_end timestamptz,
  actual_shipped_at timestamptz,
  actual_delivered_at timestamptz,
  delivery_guarantee_eligible boolean not null default false,
  delivery_guarantee_reason text,
  guaranteed_delivery_date timestamptz,
  payout_hold_status text not null default 'none' check (payout_hold_status in ('none', 'pending', 'active', 'released')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shipment_events (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid not null references public.shipments(id) on delete cascade,
  event_type text not null,
  status text,
  description text,
  location text,
  occurred_at timestamptz not null default now(),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.package_details (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid not null references public.shipments(id) on delete cascade,
  weight numeric(10,2) not null default 0,
  length numeric(10,2),
  width numeric(10,2),
  height numeric(10,2),
  package_type text,
  fragile boolean not null default false,
  signature_required boolean not null default false,
  insurance_requested boolean not null default false,
  declared_value numeric(12,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.delivery_guarantee_rules (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references public.seller_profiles(id) on delete cascade,
  product_category text,
  carrier text,
  min_on_time_shipping_rate numeric(5,2) not null default 0.96,
  max_handling_time_days integer not null default 2,
  required_verified_seller boolean not null default true,
  required_inventory_available boolean not null default true,
  enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shipment_exceptions (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid not null references public.shipments(id) on delete cascade,
  exception_type text not null check (exception_type in ('tracking_not_updating', 'carrier_delay', 'lost_package', 'damaged_in_transit', 'returned_to_sender', 'wrong_address', 'delivery_attempted', 'delivered_missing')),
  status text not null default 'open' check (status in ('open', 'under_review', 'resolved', 'closed')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.delivery_protection_cases (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  shipment_id uuid references public.shipments(id) on delete set null,
  case_type text not null check (case_type in ('item_not_shipped', 'excessively_late_shipment', 'lost_package', 'damaged_package', 'tracking_inconsistency', 'delivered_but_not_received')),
  case_status text not null default 'opened' check (case_status in ('opened', 'under_review', 'approved', 'denied', 'resolved', 'closed')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.seller_shipping_metrics (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null unique references public.seller_profiles(id) on delete cascade,
  average_handling_time_hours numeric(10,2) not null default 0,
  on_time_shipping_rate numeric(5,2) not null default 0,
  late_shipment_rate numeric(5,2) not null default 0,
  delivery_success_rate numeric(5,2) not null default 0,
  tracking_upload_rate numeric(5,2) not null default 0,
  shipment_exception_rate numeric(5,2) not null default 0,
  cancellation_rate numeric(5,2) not null default 0,
  refund_rate numeric(5,2) not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.shipping_methods enable row level security;
alter table public.seller_shipping_settings enable row level security;
alter table public.shipments enable row level security;
alter table public.shipment_events enable row level security;
alter table public.package_details enable row level security;
alter table public.delivery_guarantee_rules enable row level security;
alter table public.shipment_exceptions enable row level security;
alter table public.delivery_protection_cases enable row level security;
alter table public.seller_shipping_metrics enable row level security;

create policy "shipping_methods_public_read" on public.shipping_methods for select using (true);
create policy "seller_shipping_settings_owner_access" on public.seller_shipping_settings for all using (exists (select 1 from public.seller_profiles sp where sp.id = seller_shipping_settings.seller_id and sp.profile_id = auth.uid())) with check (exists (select 1 from public.seller_profiles sp where sp.id = seller_shipping_settings.seller_id and sp.profile_id = auth.uid()));
create policy "shipments_customer_own" on public.shipments for select using (exists (select 1 from public.orders o where o.id = shipments.order_id and o.customer_id = auth.uid()));
create policy "shipments_seller_own" on public.shipments for select using (exists (select 1 from public.seller_profiles sp where sp.id = shipments.seller_id and sp.profile_id = auth.uid()));
create policy "shipments_admin_access" on public.shipments for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')) with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "shipment_events_own" on public.shipment_events for select using (
  exists (
    select 1 from public.shipments s
    join public.orders o on o.id = s.order_id
    where s.id = shipment_events.shipment_id and (o.customer_id = auth.uid() or exists (select 1 from public.seller_profiles sp where sp.id = s.seller_id and sp.profile_id = auth.uid()) or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  )
);

create index if not exists idx_shipping_methods_seller_id on public.shipping_methods(seller_id);
create index if not exists idx_seller_shipping_settings_seller_id on public.seller_shipping_settings(seller_id);
create index if not exists idx_shipments_order_id on public.shipments(order_id);
create index if not exists idx_shipments_seller_id on public.shipments(seller_id);
create index if not exists idx_shipment_events_shipment_id on public.shipment_events(shipment_id);
create index if not exists idx_package_details_shipment_id on public.package_details(shipment_id);
create index if not exists idx_delivery_protection_cases_order_id on public.delivery_protection_cases(order_id);
create index if not exists idx_seller_shipping_metrics_seller_id on public.seller_shipping_metrics(seller_id);
