-- Phase 11: fulfillment, returns, disputes, cases, notifications, and payout controls

alter table public.orders
  add column if not exists paid_at timestamptz,
  add column if not exists processing_started_at timestamptz,
  add column if not exists ready_to_ship_at timestamptz,
  add column if not exists shipped_at timestamptz,
  add column if not exists delivered_at timestamptz,
  add column if not exists estimated_delivery_start timestamptz,
  add column if not exists estimated_delivery_end timestamptz,
  add column if not exists fulfillment_deadline timestamptz,
  add column if not exists seller_ship_by_date timestamptz,
  add column if not exists tracking_carrier text,
  add column if not exists tracking_number text,
  add column if not exists tracking_url text,
  add column if not exists shipment_status text not null default 'pending' check (shipment_status in ('pending', 'processing', 'ready_to_ship', 'shipped', 'out_for_delivery', 'delivered', 'delayed')),
  add column if not exists cancellation_status text not null default 'none' check (cancellation_status in ('none', 'requested', 'approved', 'denied', 'cancelled')),
  add column if not exists return_status text not null default 'none' check (return_status in ('none', 'requested', 'under_review', 'approved', 'denied', 'return_in_transit', 'returned', 'refund_pending', 'refunded', 'closed')),
  add column if not exists customer_protection_case_id text,
  add column if not exists payout_hold_status text not null default 'none' check (payout_hold_status in ('none', 'pending', 'active', 'released')),
  add column if not exists payout_hold_reason text,
  add column if not exists payout_hold_updated_at timestamptz,
  add column if not exists seller_note text,
  add column if not exists seller_tracking_note text,
  add column if not exists customer_contact_phone text,
  add column if not exists customer_contact_email text;

alter table public.order_items
  add column if not exists carrier text,
  add column if not exists tracking_number text,
  add column if not exists tracking_url text,
  add column if not exists shipment_status text not null default 'pending' check (shipment_status in ('pending', 'processing', 'ready_to_ship', 'shipped', 'out_for_delivery', 'delivered', 'delayed')),
  add column if not exists process_started_at timestamptz,
  add column if not exists ready_to_ship_at timestamptz,
  add column if not exists shipped_at timestamptz,
  add column if not exists estimated_delivery_start timestamptz,
  add column if not exists estimated_delivery_end timestamptz,
  add column if not exists seller_ship_by_date timestamptz,
  add column if not exists seller_note text,
  add column if not exists customer_note text;

create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  seller_id uuid references public.seller_profiles(id) on delete set null,
  order_item_id uuid references public.order_items(id) on delete set null,
  carrier text,
  tracking_number text,
  tracking_url text,
  shipment_status text not null default 'pending' check (shipment_status in ('pending', 'processing', 'ready_to_ship', 'shipped', 'out_for_delivery', 'delivered', 'delayed')),
  shipped_at timestamptz,
  delivered_at timestamptz,
  estimated_delivery_start timestamptz,
  estimated_delivery_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tracking_events (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid not null references public.shipments(id) on delete cascade,
  event_type text not null,
  event_status text,
  status_description text,
  event_location text,
  occurred_at timestamptz not null default now(),
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.cancellation_requests (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  seller_id uuid references public.seller_profiles(id) on delete set null,
  request_reason text not null,
  customer_message text,
  status text not null default 'requested' check (status in ('requested', 'approved', 'denied', 'cancelled')),
  requested_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id) on delete set null,
  seller_response text,
  admin_response text
);

create table if not exists public.return_requests (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  order_item_id uuid references public.order_items(id) on delete set null,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  seller_id uuid references public.seller_profiles(id) on delete set null,
  request_type text not null check (request_type in ('item_not_received', 'item_damaged', 'wrong_item', 'item_not_as_described', 'suspected_counterfeit', 'authenticity_concern', 'changed_mind', 'other')),
  reason text not null,
  customer_explanation text,
  status text not null default 'requested' check (status in ('requested', 'under_review', 'approved', 'denied', 'return_in_transit', 'returned', 'refund_pending', 'refunded', 'closed')),
  evidence_images jsonb not null default '[]'::jsonb,
  seller_response text,
  admin_decision text,
  refund_amount_cents bigint not null default 0,
  requested_at timestamptz not null default now(),
  reviewed_at timestamptz,
  refunded_at timestamptz
);

create table if not exists public.authenticity_disputes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  seller_id uuid references public.seller_profiles(id) on delete set null,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid references public.marketplace_products(id) on delete set null,
  item_category text,
  dispute_status text not null default 'opened' check (dispute_status in ('opened', 'seller_response_requested', 'under_review', 'verified_authentic', 'authenticity_failed', 'more_information_required', 'resolved')),
  evidence jsonb not null default '[]'::jsonb,
  written_explanation text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_protection_cases (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  seller_id uuid references public.seller_profiles(id) on delete set null,
  case_type text not null check (case_type in ('item_not_received', 'materially_not_as_described', 'damaged_item', 'counterfeit_item', 'unauthorized_seller_behavior', 'tracking_problem')),
  case_status text not null default 'opened' check (case_status in ('opened', 'under_review', 'approved', 'denied', 'resolved', 'closed')),
  case_reference text unique,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.case_messages (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.customer_protection_cases(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  sender_role text not null check (sender_role in ('customer', 'seller', 'admin')),
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.case_evidence (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.customer_protection_cases(id) on delete cascade,
  uploader_id uuid not null references public.profiles(id) on delete cascade,
  file_name text,
  storage_path text not null,
  evidence_type text,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  recipient_role text not null check (recipient_role in ('customer', 'seller', 'admin')),
  notification_type text not null,
  title text not null,
  body text not null,
  related_entity text,
  related_entity_id uuid,
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.seller_performance (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null unique references public.seller_profiles(id) on delete cascade,
  on_time_shipping_rate numeric(5,2) default 0,
  cancellation_rate numeric(5,2) default 0,
  refund_rate numeric(5,2) default 0,
  dispute_rate numeric(5,2) default 0,
  authenticity_dispute_rate numeric(5,2) default 0,
  average_handling_time_hours integer default 0,
  completed_order_count integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.payout_holds (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.seller_profiles(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  hold_status text not null default 'active' check (hold_status in ('active', 'released')),
  reason text,
  recommended_action text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_shipments_order_id on public.shipments(order_id);
create index if not exists idx_shipments_seller_id on public.shipments(seller_id);
create index if not exists idx_tracked_events_shipment_id on public.tracking_events(shipment_id);
create index if not exists idx_cancellation_requests_order_id on public.cancellation_requests(order_id);
create index if not exists idx_return_requests_order_id on public.return_requests(order_id);
create index if not exists idx_authenticity_disputes_order_id on public.authenticity_disputes(order_id);
create index if not exists idx_customer_protection_cases_customer_id on public.customer_protection_cases(customer_id);
create index if not exists idx_notifications_recipient_id on public.notifications(recipient_id, recipient_role);
create index if not exists idx_payout_holds_seller_id on public.payout_holds(seller_id);

alter table public.shipments enable row level security;
alter table public.tracking_events enable row level security;
alter table public.cancellation_requests enable row level security;
alter table public.return_requests enable row level security;
alter table public.authenticity_disputes enable row level security;
alter table public.customer_protection_cases enable row level security;
alter table public.case_messages enable row level security;
alter table public.case_evidence enable row level security;
alter table public.notifications enable row level security;
alter table public.seller_performance enable row level security;
alter table public.payout_holds enable row level security;

create policy shipments_customer_select_own on public.shipments
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = shipments.order_id and o.customer_id = auth.uid()
    )
  );

create policy shipments_seller_select_own on public.shipments
  for select using (
    exists (
      select 1 from public.seller_profiles sp
      where sp.id = shipments.seller_id and sp.profile_id = auth.uid()
    )
  );

create policy shipments_admin_select on public.shipments
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy cancellation_requests_customer_select_own on public.cancellation_requests
  for select using (auth.uid() = customer_id);

create policy cancellation_requests_seller_select_own on public.cancellation_requests
  for select using (
    exists (
      select 1 from public.seller_profiles sp
      where sp.id = cancellation_requests.seller_id and sp.profile_id = auth.uid()
    )
  );

create policy cancellation_requests_admin_select on public.cancellation_requests
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy return_requests_customer_select_own on public.return_requests
  for select using (auth.uid() = customer_id);

create policy return_requests_seller_select_own on public.return_requests
  for select using (
    exists (
      select 1 from public.seller_profiles sp
      where sp.id = return_requests.seller_id and sp.profile_id = auth.uid()
    )
  );

create policy return_requests_admin_select on public.return_requests
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy authenticity_disputes_customer_select_own on public.authenticity_disputes
  for select using (auth.uid() = customer_id);

create policy authenticity_disputes_seller_select_own on public.authenticity_disputes
  for select using (
    exists (
      select 1 from public.seller_profiles sp
      where sp.id = authenticity_disputes.seller_id and sp.profile_id = auth.uid()
    )
  );

create policy authenticity_disputes_admin_select on public.authenticity_disputes
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy customer_protection_cases_customer_select_own on public.customer_protection_cases
  for select using (auth.uid() = customer_id);

create policy customer_protection_cases_seller_select_own on public.customer_protection_cases
  for select using (
    exists (
      select 1 from public.seller_profiles sp
      where sp.id = customer_protection_cases.seller_id and sp.profile_id = auth.uid()
    )
  );

create policy customer_protection_cases_admin_select on public.customer_protection_cases
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy notifications_customer_select_own on public.notifications
  for select using (auth.uid() = recipient_id);

create policy notifications_seller_select_own on public.notifications
  for select using (
    recipient_role = 'seller' and exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role = 'vendor'
    )
  );

create policy notifications_admin_select on public.notifications
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy seller_performance_seller_select_own on public.seller_performance
  for select using (
    exists (
      select 1 from public.seller_profiles sp
      where sp.id = seller_performance.seller_id and sp.profile_id = auth.uid()
    )
  );

create policy seller_performance_admin_select on public.seller_performance
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy payout_holds_seller_select_own on public.payout_holds
  for select using (
    exists (
      select 1 from public.seller_profiles sp
      where sp.id = payout_holds.seller_id and sp.profile_id = auth.uid()
    )
  );

create policy payout_holds_admin_select on public.payout_holds
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy payout_holds_admin_update on public.payout_holds
  for update using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );
