insert into public.categories (name, slug, description)
values
  ('Electronics', 'electronics', 'Premium tech and accessories'),
  ('Fashion', 'fashion', 'Luxury apparel and curated collectibles'),
  ('Beauty', 'beauty', 'Beauty and haircare essentials'),
  ('Fitness', 'fitness', 'Strength and wellness products'),
  ('Home', 'home', 'Furniture and interior accents'),
  ('Studio', 'studio', 'Audio and production gear'),
  ('Pet Supplies', 'pet-supplies', 'Premium pet essentials'),
  ('Health', 'health', 'Daily wellness and vitality items')
on conflict (slug) do nothing;
