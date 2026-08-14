-- Phase 12: admin governance, moderation, fee configuration, audit logging, and risk controls

create table if not exists public.admin_notes (
  id uuid primary key default gen_random_uuid(),
  target_type text not null,
  target_id uuid not null,
  author_id uuid references public.profiles(id) on delete set null,
  note text not null,
  is_internal boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.moderation_decisions (
  id uuid primary key default gen_random_uuid(),
  target_type text not null,
  target_id uuid not null,
  moderation_type text not null,
  decision text not null,
  reason text,
  decided_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.fee_settings (
  id uuid primary key default gen_random_uuid(),
  scope_type text not null default 'marketplace' check (scope_type in ('marketplace', 'category', 'seller', 'premium_seller')),
  scope_id uuid,
  default_marketplace_fee numeric(5,2) not null default 8.00,
  category_specific_fee numeric(5,2),
  seller_specific_fee numeric(5,2),
  premium_seller_fee numeric(5,2),
  minimum_platform_fee_cents bigint not null default 0,
  effective_from timestamptz not null default now(),
  is_active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.category_settings (
  id uuid primary key default gen_random_uuid(),
  category_name text not null,
  parent_category_id uuid,
  display_order integer not null default 0,
  is_enabled boolean not null default true,
  requires_authenticity_check boolean not null default false,
  is_high_value boolean not null default false,
  default_commission_override numeric(5,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.risk_flags (
  id uuid primary key default gen_random_uuid(),
  target_type text not null,
  target_id uuid not null,
  seller_id uuid references public.seller_profiles(id) on delete set null,
  risk_level text not null default 'low' check (risk_level in ('low', 'medium', 'high', 'critical')),
  risk_type text not null,
  risk_summary text,
  is_internal boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references public.profiles(id) on delete cascade,
  action text not null,
  target_type text not null,
  target_id uuid,
  before_metadata jsonb,
  after_metadata jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.review_moderation (
  id uuid primary key default gen_random_uuid(),
  review_type text not null check (review_type in ('product', 'seller')),
  review_id uuid not null,
  moderation_status text not null default 'visible' check (moderation_status in ('visible', 'flagged', 'removed', 'restored')),
  admin_note text,
  moderated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_admin_notes_target on public.admin_notes(target_type, target_id);
create index if not exists idx_moderation_decisions_target on public.moderation_decisions(target_type, target_id);
create index if not exists idx_fee_settings_active on public.fee_settings(is_active, effective_from);
create index if not exists idx_category_settings_enabled on public.category_settings(is_enabled, display_order);
create index if not exists idx_risk_flags_target on public.risk_flags(target_type, target_id);
create index if not exists idx_admin_audit_logs_admin on public.admin_audit_logs(admin_user_id, created_at desc);

alter table public.admin_notes enable row level security;
alter table public.moderation_decisions enable row level security;
alter table public.fee_settings enable row level security;
alter table public.category_settings enable row level security;
alter table public.risk_flags enable row level security;
alter table public.admin_audit_logs enable row level security;
alter table public.review_moderation enable row level security;

create policy admin_notes_admin_read_write on public.admin_notes
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy moderation_decisions_admin_read_write on public.moderation_decisions
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy fee_settings_admin_read_write on public.fee_settings
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy category_settings_admin_read_write on public.category_settings
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy risk_flags_admin_read_write on public.risk_flags
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy admin_audit_logs_admin_read_only on public.admin_audit_logs
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy review_moderation_admin_read_write on public.review_moderation
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy fee_settings_public_read on public.fee_settings
  for select using (true);

create policy category_settings_public_read on public.category_settings
  for select using (true);

create policy review_moderation_public_read on public.review_moderation
  for select using (moderation_status in ('visible', 'restored'));
