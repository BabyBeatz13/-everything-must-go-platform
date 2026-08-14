-- Phase 10: luxury authenticity, verification metadata, and privacy controls

alter table public.seller_profiles
  add column if not exists seller_trust_level text not null default 'New Seller' check (seller_trust_level in ('New Seller', 'Verified Seller', 'Verified Luxury Seller', 'Trusted Seller')),
  add column if not exists identity_verified boolean not null default false,
  add column if not exists business_verified boolean not null default false,
  add column if not exists seller_review_status text not null default 'pending' check (seller_review_status in ('pending', 'approved', 'rejected', 'needs_more_information')),
  add column if not exists luxury_seller_approval_status text not null default 'pending' check (luxury_seller_approval_status in ('pending', 'approved', 'rejected', 'needs_more_information')),
  add column if not exists seller_risk_status text not null default 'clear' check (seller_risk_status in ('clear', 'review', 'restricted', 'suspended')),
  add column if not exists luxury_seller_badge boolean not null default false,
  add column if not exists verification_badge boolean not null default false,
  add column if not exists storefront_country text,
  add column if not exists location_country text,
  add column if not exists about_store text,
  add column if not exists contact_support text,
  add column if not exists logo_url text,
  add column if not exists banner_url text,
  add column if not exists social_links jsonb not null default '{}'::jsonb,
  add column if not exists shipping_policy text,
  add column if not exists return_policy text;

alter table public.marketplace_products
  add column if not exists authenticity_status text not null default 'not_required' check (authenticity_status in ('not_required', 'pending_verification', 'verified', 'rejected', 'needs_more_information')),
  add column if not exists authenticity_review_required boolean not null default false,
  add column if not exists authenticity_notes text,
  add column if not exists suspicious_flags text[] not null default '{}',
  add column if not exists private_verification_docs jsonb not null default '[]'::jsonb,
  add column if not exists jewelry_type text,
  add column if not exists metal_type text,
  add column if not exists gold_karat text,
  add column if not exists metal_purity text,
  add column if not exists metal_weight text,
  add column if not exists chain_length text,
  add column if not exists chain_width text,
  add column if not exists gemstone_type text,
  add column if not exists diamond_type text,
  add column if not exists diamond_disclosure text,
  add column if not exists total_carat_weight text,
  add column if not exists diamond_color text,
  add column if not exists diamond_clarity text,
  add column if not exists diamond_cut text,
  add column if not exists certification_lab text,
  add column if not exists certification_number text,
  add column if not exists appraisal_value numeric(12,2),
  add column if not exists country_of_origin text,
  add column if not exists hallmark_details text,
  add column if not exists designer text,
  add column if not exists model text,
  add column if not exists collection text,
  add column if not exists material text,
  add column if not exists color text,
  add column if not exists size text,
  add column if not exists serial_number text,
  add column if not exists date_code text,
  add column if not exists country_of_manufacture text,
  add column if not exists year text,
  add column if not exists condition_details text,
  add column if not exists original_packaging_included boolean not null default false,
  add column if not exists dust_bag_included boolean not null default false,
  add column if not exists receipt_available boolean not null default false,
  add column if not exists authentication_certificate_available boolean not null default false,
  add column if not exists product_validation_url text;

create table if not exists public.listing_authenticity_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.marketplace_products(id) on delete cascade,
  seller_id uuid not null references public.seller_profiles(id) on delete cascade,
  status text not null default 'pending_verification' check (status in ('not_required', 'pending_verification', 'verified', 'rejected', 'needs_more_information')),
  review_notes text,
  admin_id uuid references public.profiles(id) on delete set null,
  producer_documents jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_verification_documents (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.marketplace_products(id) on delete cascade,
  seller_id uuid not null references public.seller_profiles(id) on delete cascade,
  document_type text not null,
  storage_path text not null,
  file_name text,
  is_private boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_listing_authenticity_reviews_product_id on public.listing_authenticity_reviews(product_id);
create index if not exists idx_listing_authenticity_reviews_status on public.listing_authenticity_reviews(status);
create index if not exists idx_product_verification_documents_product_id on public.product_verification_documents(product_id);
create index if not exists idx_product_verification_documents_seller_id on public.product_verification_documents(seller_id);

alter table public.listing_authenticity_reviews enable row level security;
alter table public.product_verification_documents enable row level security;

create policy listing_authenticity_reviews_seller_read_own on public.listing_authenticity_reviews
  for select using (
    exists (
      select 1 from public.seller_profiles sp
      where sp.id = listing_authenticity_reviews.seller_id and sp.profile_id = auth.uid()
    )
  );

create policy listing_authenticity_reviews_admin_read on public.listing_authenticity_reviews
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy listing_authenticity_reviews_admin_update on public.listing_authenticity_reviews
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

create policy product_verification_documents_seller_select_own on public.product_verification_documents
  for select using (
    exists (
      select 1 from public.seller_profiles sp
      where sp.id = product_verification_documents.seller_id and sp.profile_id = auth.uid()
    )
  );

create policy product_verification_documents_admin_select on public.product_verification_documents
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy product_verification_documents_seller_insert_own on public.product_verification_documents
  for insert with check (
    exists (
      select 1 from public.seller_profiles sp
      where sp.id = product_verification_documents.seller_id and sp.profile_id = auth.uid()
    )
    and product_verification_documents.is_private = true
  );

create policy product_verification_documents_seller_update_own on public.product_verification_documents
  for update using (
    exists (
      select 1 from public.seller_profiles sp
      where sp.id = product_verification_documents.seller_id and sp.profile_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.seller_profiles sp
      where sp.id = product_verification_documents.seller_id and sp.profile_id = auth.uid()
    )
  );

create policy product_verification_documents_seller_delete_own on public.product_verification_documents
  for delete using (
    exists (
      select 1 from public.seller_profiles sp
      where sp.id = product_verification_documents.seller_id and sp.profile_id = auth.uid()
    )
  );

create policy marketplace_products_public_visibility on public.marketplace_products
  for select using (status = 'active' and authenticity_status in ('not_required', 'verified'));

create policy marketplace_products_seller_private_review_access on public.marketplace_products
  for select using (
    exists (
      select 1 from public.seller_profiles sp
      where sp.id = marketplace_products.seller_id and sp.profile_id = auth.uid()
    )
  );
