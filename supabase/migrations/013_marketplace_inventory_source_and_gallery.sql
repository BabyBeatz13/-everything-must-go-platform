-- Phase 16: inventory source separation and seller/external listing metadata

alter table public.marketplace_products
  add column if not exists model text,
  add column if not exists year_era text,
  add column if not exists tags text[] not null default '{}',
  add column if not exists image_primary_index integer not null default 0,
  add column if not exists primary_image_url text,
  add column if not exists availability text not null default 'unknown' check (availability in ('in_stock', 'low_stock', 'out_of_stock', 'unknown')),
  add column if not exists source_type text not null default 'seller' check (source_type in ('seller', 'affiliate', 'admin_curated', 'merchant_feed', 'development_seed')),
  add column if not exists external_product_id text,
  add column if not exists source_updated_at timestamptz;

create index if not exists idx_marketplace_products_source_type on public.marketplace_products(source_type);
create index if not exists idx_marketplace_products_availability on public.marketplace_products(availability);
create index if not exists idx_marketplace_products_created_at on public.marketplace_products(created_at);
