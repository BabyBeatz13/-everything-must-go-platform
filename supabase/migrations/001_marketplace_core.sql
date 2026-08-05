create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  avatar_url text,
  role text not null default 'customer' check (role in ('customer', 'vendor', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  business_name text not null,
  business_slug text not null unique,
  status text not null default 'pending' check (status in ('pending', 'active', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  parent_id uuid references public.categories(id) on delete set null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references public.vendors(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  description text,
  price numeric(12,2) not null default 0,
  inventory integer not null default 0 check (inventory >= 0),
  shipping text not null default 'standard',
  commission_percentage numeric(5,2) not null default 0 check (commission_percentage >= 0 and commission_percentage <= 100),
  status text not null default 'draft' check (status in ('draft', 'active', 'paused', 'archived')),
  is_featured boolean not null default false,
  in_stock boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.affiliate_products (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  merchant text not null check (merchant in ('amazon', 'walmart', 'ebay', 'etsy', 'best_buy', 'sweetwater', 'stockx', 'goat', 'newegg')),
  affiliate_url text not null,
  commission_rate numeric(5,2) not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.profiles(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  total_amount numeric(12,2) not null default 0,
  currency text not null default 'USD',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  quantity integer not null default 1 check (quantity >= 1),
  unit_price numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (profile_id, product_id)
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (profile_id, product_id)
);

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'saved', 'converted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id)
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid references public.carts(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  quantity integer not null default 1 check (quantity >= 1),
  created_at timestamptz not null default now(),
  unique (cart_id, product_id)
);

alter table public.profiles enable row level security;
alter table public.vendors enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.affiliate_products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.favorites enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;

create policy "profiles_are_public_read" on public.profiles for select using (true);
create policy "profiles_can_update_own_record" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "vendors_are_public_read" on public.vendors for select using (true);
create policy "categories_are_public_read" on public.categories for select using (true);
create policy "products_are_public_read" on public.products for select using (true);
create policy "product_images_are_public_read" on public.product_images for select using (true);
create policy "affiliate_products_are_public_read" on public.affiliate_products for select using (true);
create policy "orders_are_customer_read" on public.orders for select using (auth.uid() = customer_id);
create policy "order_items_are_customer_read" on public.order_items for select using (
  exists (
    select 1 from public.orders o
    where o.id = order_items.order_id and o.customer_id = auth.uid()
  )
);
create policy "reviews_are_public_read" on public.reviews for select using (true);
create policy "favorites_are_profile_read" on public.favorites for select using (auth.uid() = profile_id);
create policy "carts_are_profile_read" on public.carts for select using (auth.uid() = profile_id);
create policy "cart_items_are_profile_read" on public.cart_items for select using (
  exists (
    select 1 from public.carts c
    where c.id = cart_items.cart_id and c.profile_id = auth.uid()
  )
);

create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_vendors_profile_id on public.vendors(profile_id);
create index if not exists idx_vendors_business_slug on public.vendors(business_slug);
create index if not exists idx_products_vendor_id on public.products(vendor_id);
create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_products_featured on public.products(is_featured);
create index if not exists idx_product_images_product_id on public.product_images(product_id);
create index if not exists idx_affiliate_products_product_id on public.affiliate_products(product_id);
create index if not exists idx_orders_customer_id on public.orders(customer_id);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_reviews_product_id on public.reviews(product_id);
create index if not exists idx_favorites_profile_id on public.favorites(profile_id);
create index if not exists idx_carts_profile_id on public.carts(profile_id);
create index if not exists idx_cart_items_cart_id on public.cart_items(cart_id);
