create table if not exists public.seller_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  store_name text not null,
  logo_url text,
  bio text,
  contact_email text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.seller_applications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  business_name text not null,
  store_name text not null,
  contact_email text not null,
  bio text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.marketplace_products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.seller_profiles(id) on delete cascade,
  title text not null,
  description text,
  category text not null,
  subcategory text,
  brand text,
  price numeric(12,2) not null default 0,
  compare_at_price numeric(12,2) default 0,
  inventory_quantity integer not null default 0 check (inventory_quantity >= 0),
  sku text not null unique,
  condition text not null default 'new' check (condition in ('new', 'used', 'vintage', 'collectible', 'refurbished')),
  shipping_price numeric(12,2) not null default 0,
  free_shipping boolean not null default false,
  product_images text[] not null default '{}',
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'active', 'paused', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.seller_profiles enable row level security;
alter table public.seller_applications enable row level security;
alter table public.marketplace_products enable row level security;

create policy "seller_profiles_are_public_read" on public.seller_profiles
  for select using (status = 'approved');

create policy "seller_profiles_can_update_own_record" on public.seller_profiles
  for update using (auth.uid() = profile_id)
  with check (
    auth.uid() = profile_id
    and status <> 'approved'
  );

create policy "seller_applications_are_profile_read" on public.seller_applications
  for select using (auth.uid() = profile_id);

create policy "seller_applications_can_update_own_record" on public.seller_applications
  for update using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id and status <> 'approved');

create policy "marketplace_products_public_read" on public.marketplace_products
  for select using (status = 'active');

create policy "marketplace_products_seller_manage_own" on public.marketplace_products
  for insert with check (
    exists (
      select 1 from public.seller_profiles sp
      where sp.id = marketplace_products.seller_id and sp.profile_id = auth.uid() and sp.status = 'approved'
    )
  );

create policy "marketplace_products_seller_update_own" on public.marketplace_products
  for update using (
    exists (
      select 1 from public.seller_profiles sp
      where sp.id = marketplace_products.seller_id and sp.profile_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.seller_profiles sp
      where sp.id = marketplace_products.seller_id and sp.profile_id = auth.uid()
    )
  );

create policy "marketplace_products_seller_delete_own" on public.marketplace_products
  for delete using (
    exists (
      select 1 from public.seller_profiles sp
      where sp.id = marketplace_products.seller_id and sp.profile_id = auth.uid()
    )
  );

create policy "seller_approval_is_admin_only" on public.seller_profiles
  for update using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "applications_approval_is_admin_only" on public.seller_applications
  for update using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create index if not exists idx_seller_profiles_profile_id on public.seller_profiles(profile_id);
create index if not exists idx_seller_profiles_status on public.seller_profiles(status);
create index if not exists idx_seller_applications_profile_id on public.seller_applications(profile_id);
create index if not exists idx_marketplace_products_seller_id on public.marketplace_products(seller_id);
create index if not exists idx_marketplace_products_status on public.marketplace_products(status);
create index if not exists idx_marketplace_products_featured on public.marketplace_products(featured);
