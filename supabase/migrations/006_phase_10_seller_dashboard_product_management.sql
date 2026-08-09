-- Phase 10: Seller dashboard and product management enhancements

alter table public.seller_profiles
  add column if not exists banner_url text,
  add column if not exists social_links jsonb not null default '{}'::jsonb,
  add column if not exists shipping_policy text,
  add column if not exists return_policy text,
  add column if not exists store_description text;

alter table public.marketplace_products
  add column if not exists slug text,
  add column if not exists variants jsonb not null default '[]'::jsonb,
  add column if not exists image_gallery jsonb not null default '[]'::jsonb,
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists shipping_class text,
  add column if not exists weight_grams integer,
  add column if not exists dimensions jsonb not null default '{}'::jsonb,
  add column if not exists view_count integer not null default 0,
  add column if not exists sold_count integer not null default 0;

create unique index if not exists idx_marketplace_products_slug_unique on public.marketplace_products(slug) where slug is not null;
create index if not exists idx_marketplace_products_view_count on public.marketplace_products(view_count);
create index if not exists idx_marketplace_products_sold_count on public.marketplace_products(sold_count);

-- Allow sellers to update their own profile details after approval.
drop policy if exists seller_profiles_can_update_own_record on public.seller_profiles;

create policy seller_profiles_can_update_own_record on public.seller_profiles
  for update using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

-- Allow sellers to update fulfillment fields for their own order items.
drop policy if exists order_items_seller_update_own on public.order_items;

create policy order_items_seller_update_own on public.order_items
  for update using (
    exists (
      select 1 from public.seller_profiles sp
      where sp.id = order_items.seller_id and sp.profile_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.seller_profiles sp
      where sp.id = order_items.seller_id and sp.profile_id = auth.uid()
    )
  );
