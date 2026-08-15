export type ProductSource = "storefront" | "seller" | "affiliate" | "imported";

export type SearchableProduct = {
  id: string;
  source: ProductSource;
  source_id: string | null;
  title: string;
  description: string;
  brand: string;
  category: string;
  subcategory: string;
  tags: string[];
  seller: string;
  seller_slug: string | null;
  product_url: string | null;
  image: string;
  price: number;
  condition: string;
  year: number | null;
  release_date: string | null;
  created_at: string;
  vintage: boolean;
  collectible: boolean;
  verified: boolean;
  authenticity_status: string;
  stock_status: string;
  search_keywords: string[];
  manufacturer?: string | null;
  model?: string | null;
  sku?: string | null;
  country_of_origin?: string | null;
  searchText: string;
};

export type SearchOptions = {
  search?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  seller?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  freeShipping?: boolean;
  vintage?: boolean;
  collectible?: boolean;
  verified?: boolean;
  sort?: "relevance" | "newest" | "oldest" | "price_asc" | "price_desc" | "highest_rated";
};

const searchSynonyms: Record<string, string[]> = {
  iphone: ["apple phone", "iphone", "smartphone", "cell phone", "phone"],
  "cell phone": ["iphone", "smartphone", "phone"],
  "cuban link": ["cuban chain", "cuban necklace", "cuban links"],
  perfume: ["fragrance", "cologne", "women's perfume", "men's cologne"],
  cologne: ["fragrance", "perfume", "men's fragrance"],
  purse: ["handbag", "bag"],
  dresser: ["chest of drawers"],
  tv: ["television"],
  "game system": ["console", "video game console"],
  retro: ["vintage"],
  "wrestling toy": ["wrestling figure", "action figure"],
  earrings: ["ear rings"],
  jewelry: ["fine jewelry", "gold jewelry", "diamond jewelry", "necklaces", "pendants", "rings", "bracelets", "watches"],
  furniture: ["home furniture", "living room furniture", "dining room furniture"],
  "gold chain": ["gold chains", "cuban chain", "gold jewelry"],
  "diamond earrings": ["diamond earrings", "diamond ear studs", "gemstone earrings"],
  "nintendo": ["nintendo switch", "console", "retro console"],
};

const categoryRegistry: Record<string, string[]> = {
  electronics: ["electronics", "phones", "computers", "gaming", "headphones", "laptops", "tablets", "cameras", "tv", "television", "audio equipment", "home audio"],
  phones: ["phones", "cell phones", "smartphones", "iphone", "android phones", "mobile phones"],
  computers: ["computers", "laptops", "desktops", "pc", "apple computers", "macbooks"],
  gaming: ["gaming", "video games", "consoles", "game systems", "controllers", "gaming accessories"],
  "vintage gaming": ["vintage gaming", "retro games", "vintage consoles", "retro consoles", "handhelds", "classic gaming"],
  fashion: ["fashion", "apparel", "bags", "handbags", "designer handbags", "sneakers", "shirts", "fan apparel", "accessories", "vintage fashion"],
  sneakers: ["sneakers", "trainers", "designer sneakers", "luxury sneakers", "sport sneakers"],
  shirts: ["shirts", "tees", "tops", "designer shirts", "button down shirts"],
  "fan apparel": ["fan apparel", "jerseys", "sportswear", "team apparel", "licensed merchandise"],
  beauty: ["beauty", "cosmetics", "hair", "wigs", "beauty tools", "luxury beauty"],
  fragrance: ["fragrance", "perfume", "cologne", "men's cologne", "women's perfume", "unisex fragrance", "luxury fragrance", "vintage fragrance", "designer fragrance", "niche fragrance", "gift sets"],
  cologne: ["cologne", "men's cologne", "fragrance", "male fragrance", "luxury cologne"],
  perfume: ["perfume", "women's perfume", "fragrance", "luxury perfume", "designer perfume"],
  "fine jewelry": ["fine jewelry", "gold jewelry", "diamonds", "diamond jewelry", "watches", "necklaces", "pendants", "earrings", "bracelets", "rings", "jewelry"],
  "gold jewelry": ["gold jewelry", "gold chains", "cuban links", "gold necklaces", "gold bracelets", "gold rings"],
  diamonds: ["diamonds", "diamond jewelry", "diamond chains", "diamond rings", "diamond earrings", "diamond pendants"],
  watches: ["watches", "luxury watches", "mens watches", "womens watches", "vintage watches"],
  "luxury handbags": ["luxury handbags", "designer handbags", "authentic handbags", "premium bags", "leather handbags"],
  bags: ["bags", "handbags", "crossbody", "totes", "leather bags", "luxury bags"],
  fitness: ["fitness", "exercise", "training", "workout", "strength", "wellness"],
  "health & wellness": ["health", "wellness", "supplements", "vitamins", "wellness bundles", "health & wellness"],
  home: ["home", "living room", "bedroom", "home decor", "interior"],
  furniture: ["furniture", "home furniture", "living room furniture", "dining room furniture", "lamps", "mirrors", "dressers", "tables", "chairs", "beds", "console", "ottoman", "vintage furniture"],
  "home decor": ["home decor", "decor", "lighting", "lamps", "mirrors", "accent furniture"],
  garden: ["garden", "gardening", "outdoor", "plants", "seeds", "flowers"],
  seeds: ["seeds", "vegetable seeds", "flower seeds", "herb seeds", "fruit seeds", "gardening"],
  "studio equipment": ["studio", "studio equipment", "recording equipment", "microphones", "audio interfaces", "studio monitors", "music software", "recording gear"],
  "music software": ["music software", "production software", "plugins", "audio software"],
  "pet supplies": ["pet supplies", "pet products", "pet accessories", "pet care"],
  collectibles: ["collectibles", "vintage collectibles", "wrestling figures", "memorabilia", "trading cards", "comics", "sports memorabilia", "collectible toys"],
  "vintage toys": ["vintage toys", "retro toys", "action figures", "vintage action figures", "collectible toys"],
  "wrestling collectibles": ["wrestling collectibles", "wrestling memorabilia", "wrestling figures", "wrestling action figures"],
  "sports memorabilia": ["sports memorabilia", "signed memorabilia", "sports collectibles", "athletic collectibles"],
  "trading cards": ["trading cards", "sports cards", "collectible cards", "pokemon cards"],
  comics: ["comics", "comic books", "graphic novels", "collectible comics"],
  vinyl: ["vinyl", "vinyl records", "records", "music vinyl"],
  "vintage electronics": ["vintage electronics", "retro electronics", "classic audio", "vintage tech"],
  "vintage fashion": ["vintage fashion", "vintage clothing", "vintage handbags", "retro fashion"],
  "vintage furniture": ["vintage furniture", "retro furniture", "antique furniture", "mid century furniture"],
  jewelry: ["jewelry", "fine jewelry", "gold jewelry", "diamonds", "watches", "necklaces", "pendants", "earrings", "bracelets", "rings", "gold chains", "cuban links"],
  vintage: ["vintage", "retro", "vintage games", "retro games", "vintage electronics", "vintage toys", "vintage jewelry", "vintage furniture", "vintage fragrance"],
  studio: ["studio", "studio equipment", "music software", "microphones", "audio interfaces", "studio monitors", "recording equipment"],
};

function normalizeKeyword(value: string | null | undefined): string {
  return String(value ?? "").trim().toLowerCase();
}

function singularizeToken(token: string): string {
  const trimmed = token.trim().toLowerCase();
  if (!trimmed || trimmed.length <= 3) return trimmed;
  if (trimmed.endsWith("ies") && trimmed.length > 4) return `${trimmed.slice(0, -3)}y`;
  if (trimmed.endsWith("sses")) return trimmed.slice(0, -2);
  if (trimmed.endsWith("s") && !trimmed.endsWith("ss")) return trimmed.slice(0, -1);
  return trimmed;
}

function buildTokens(value: string): string[] {
  return normalizeKeyword(value)
    .split(/[^a-z0-9]+/)
    .map(singularizeToken)
    .filter(Boolean);
}

function levenshteinDistance(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  return matrix[a.length][b.length];
}

function fuzzyMatchToken(token: string, haystack: string): boolean {
  if (!token || !haystack) return false;
  if (haystack.includes(token)) return true;

  const haystackTokens = buildTokens(haystack);
  for (const candidate of haystackTokens) {
    if (candidate === token) return true;
    if (candidate.startsWith(token) || token.startsWith(candidate)) return true;
    if (candidate.length > 3 && token.length > 3 && levenshteinDistance(candidate, token) <= 1) return true;
  }

  return false;
}

function expandQueryTerms(rawTerms: string): string[] {
  const normalized = normalizeKeyword(rawTerms);
  if (!normalized) return [];

  const terms = normalized.split(/\s+/).filter(Boolean);
  const expanded = new Set<string>();

  for (const term of terms) {
    expanded.add(term);
    for (const candidate of searchSynonyms[term] ?? []) {
      expanded.add(candidate);
      for (const token of buildTokens(candidate)) {
        expanded.add(token);
      }
    }
    for (const token of buildTokens(term)) {
      expanded.add(token);
    }
  }

  return Array.from(expanded).map(singularizeToken).filter(Boolean);
}

function categoryAliasMatches(category: string, query: string): boolean {
  const normalizedCategory = normalizeKeyword(category);
  const normalizedQuery = normalizeKeyword(query);
  if (!normalizedCategory || !normalizedQuery) return false;

  const aliases = categoryRegistry[normalizedQuery] ?? [];
  if (normalizedCategory === normalizedQuery) return true;
  if (aliases.some((alias) => alias === normalizedCategory)) return true;

  const queryAliasSet = new Set([normalizedQuery, ...aliases]);
  return Array.from(queryAliasSet).some((alias) => normalizedCategory.includes(alias) || alias.includes(normalizedCategory));
}

export function buildSearchKeywords(product: Partial<SearchableProduct>): string[] {
  const fields = [
    product.title,
    product.description,
    product.brand,
    product.category,
    product.subcategory,
    product.seller,
    product.tags?.join(" "),
    product.manufacturer,
    product.model,
    product.sku,
    product.condition,
    product.country_of_origin,
    product.search_keywords?.join(" "),
  ];

  return Array.from(
    new Set(
      fields
        .filter(Boolean)
        .map((field) => field?.toString() ?? "")
        .join(" ")
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .map(singularizeToken)
        .filter(Boolean),
    ),
  );
}

export function buildSearchDocument(product: Partial<SearchableProduct>): SearchableProduct {
  const title = product.title ?? "";
  const description = product.description ?? "";
  const brand = product.brand ?? "";
  const category = product.category ?? "";
  const subcategory = product.subcategory ?? "";
  const tagSet = Array.isArray(product.tags) ? product.tags : [];
  const seller = product.seller ?? "";
  const searchKeywords = buildSearchKeywords({
    ...product,
    title,
    description,
    brand,
    category,
    subcategory,
    seller,
    tags: tagSet,
  });

  const combinedText = [
    title,
    description,
    brand,
    category,
    subcategory,
    seller,
    tagSet.join(" "),
    product.manufacturer ?? "",
    product.model ?? "",
    product.sku ?? "",
    product.condition ?? "",
    product.country_of_origin ?? "",
    ...searchKeywords,
  ].join(" ").toLowerCase();

  return {
    id: product.id ?? "",
    source: (product.source ?? "storefront") as ProductSource,
    source_id: product.source_id ?? null,
    title,
    description,
    brand,
    category,
    subcategory,
    tags: tagSet,
    seller,
    seller_slug: product.seller_slug ?? null,
    product_url: product.product_url ?? null,
    image: product.image ?? "",
    price: Number(product.price ?? 0),
    condition: product.condition ?? "New",
    year: typeof product.year === "number" ? product.year : null,
    release_date: product.release_date ?? null,
    created_at: product.created_at ?? new Date().toISOString(),
    vintage: Boolean(product.vintage),
    collectible: Boolean(product.collectible),
    verified: Boolean(product.verified),
    authenticity_status: product.authenticity_status ?? "not_required",
    stock_status: product.stock_status ?? "in_stock",
    search_keywords: searchKeywords,
    manufacturer: product.manufacturer ?? null,
    model: product.model ?? null,
    sku: product.sku ?? null,
    country_of_origin: product.country_of_origin ?? null,
    searchText: combinedText,
  };
}

export function productMatchesSearch(document: SearchableProduct, rawQuery: string): boolean {
  const query = normalizeKeyword(rawQuery);
  if (!query) return true;

  const expandedQueryTerms = expandQueryTerms(query);
  const queryString = expandedQueryTerms.join(" ");

  if (!queryString) return true;

  const sourceText = document.searchText;
  if (!sourceText) return false;

  const matchByTerm = (term: string) => {
    if (!term) return false;
    if (sourceText.includes(term)) return true;
    if (document.category && categoryAliasMatches(document.category, term)) return true;
    if (document.subcategory && categoryAliasMatches(document.subcategory, term)) return true;
    if (document.brand && fuzzyMatchToken(term, document.brand)) return true;
    if (document.title && fuzzyMatchToken(term, document.title)) return true;
    if (document.description && fuzzyMatchToken(term, document.description)) return true;
    return false;
  };

  if (expandedQueryTerms.some((term) => matchByTerm(term))) return true;

  const queryTokens = buildTokens(query);
  if (queryTokens.length > 1) {
    return queryTokens.some((term) => matchByTerm(term));
  }

  return false;
}

export function searchMarketplaceItems<T extends SearchableProduct>(items: T[], options: SearchOptions = {}): T[] {
  const query = normalizeKeyword(options.search);
  const category = normalizeKeyword(options.category);
  const subcategory = normalizeKeyword(options.subcategory);
  const brand = normalizeKeyword(options.brand);
  const seller = normalizeKeyword(options.seller);
  const condition = normalizeKeyword(options.condition);

  const filtered = items.filter((item) => {
    if (query && !productMatchesSearch(item, query)) return false;
    if (category && !(item.category ? categoryAliasMatches(item.category, category) : false)) return false;
    if (subcategory && normalizeKeyword(item.subcategory) !== subcategory) return false;
    if (brand && normalizeKeyword(item.brand) !== brand && !item.brand.toLowerCase().includes(brand)) return false;
    if (seller && normalizeKeyword(item.seller) !== seller && !item.seller.toLowerCase().includes(seller)) return false;
    if (condition && normalizeKeyword(item.condition) !== condition) return false;
    if (typeof options.minPrice === "number" && item.price < options.minPrice) return false;
    if (typeof options.maxPrice === "number" && item.price > options.maxPrice) return false;
    if (options.inStock && item.stock_status !== "in_stock") return false;
    if (options.freeShipping && !item.search_keywords.includes("free shipping")) return false;
    if (typeof options.vintage === "boolean" && item.vintage !== options.vintage) return false;
    if (typeof options.collectible === "boolean" && item.collectible !== options.collectible) return false;
    if (typeof options.verified === "boolean" && item.verified !== options.verified) return false;

    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (options.sort) {
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "highest_rated":
        return (b.search_keywords.length || 0) - (a.search_keywords.length || 0);
      case "relevance":
      default:
        if (query) {
          const aScore = a.searchText.includes(query) ? 4 : 0 + (a.title.toLowerCase().includes(query) ? 2 : 0);
          const bScore = b.searchText.includes(query) ? 4 : 0 + (b.title.toLowerCase().includes(query) ? 2 : 0);
          return bScore - aScore;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  return sorted;
}

export function getUniversalCategoryRegistry() {
  return Object.keys(categoryRegistry).sort();
}

export function getSearchSuggestions(query: string, itemList: SearchableProduct[]): string[] {
  const normalized = normalizeKeyword(query);
  if (!normalized) return [];

  const suggestions = new Set<string>();

  for (const item of itemList) {
    const haystacks = [item.title, item.brand, item.category, item.subcategory, item.seller, item.tags.join(" ")];
    for (const haystack of haystacks) {
      const text = normalizeKeyword(haystack);
      if (!text) continue;
      if (text.includes(normalized) || fuzzyMatchToken(normalized, text)) {
        suggestions.add(text);
      }
    }
  }

  return Array.from(suggestions).slice(0, 8);
}
