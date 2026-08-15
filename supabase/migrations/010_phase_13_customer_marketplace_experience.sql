create table if not exists public.customer_wishlist (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  product_id text not null,
  title text not null,
  price numeric(12,2) not null default 0,
  image_url text,
  category text,
  store_name text,
  created_at timestamptz not null default now(),
  unique (profile_id, product_id)
);

create table if not exists public.recently_viewed (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  product_id text not null,
  title text not null,
  price numeric(12,2) not null default 0,
  image_url text,
  category text,
  store_name text,
  viewed_at timestamptz not null default now(),
  unique (profile_id, product_id)
);

alter table public.customer_wishlist enable row level security;
alter table public.recently_viewed enable row level security;

create policy "customer_wishlist_profile_read_write" on public.customer_wishlist
for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create policy "recently_viewed_profile_read_write" on public.recently_viewed
for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create index if not exists idx_customer_wishlist_profile_id on public.customer_wishlist(profile_id);
create index if not exists idx_recently_viewed_profile_id on public.recently_viewed(profile_id);
create index if not exists idx_recently_viewed_viewed_at on public.recently_viewed(viewed_at desc);
