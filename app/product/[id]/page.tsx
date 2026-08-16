import Link from "next/link";
import { notFound } from "next/navigation";
import { getMarketplaceProductById, getMarketplaceProducts } from "@/lib/marketplace";
import { resolveProductImage } from "@/lib/product-images";
import { MarketplaceProductActions } from "@/components/MarketplaceProductActions";
import { RecentlyViewedTracker } from "@/components/RecentlyViewedTracker";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getMarketplaceProductById(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = (await getMarketplaceProducts({ category: product.category })).filter((item) => item.id !== product.id).slice(0, 4);
  const imageMetadata = resolveProductImage({
    id: product.id,
    title: product.title,
    category: product.category,
    brand: product.brand,
    image: product.image,
    gallery_images: product.imageGallery,
    imageSource: product.imageSource,
  });
  const galleryImages = imageMetadata.gallery_images.length > 0 ? imageMetadata.gallery_images : [imageMetadata.primary_image_url];
  const isAffiliateItem = product.sourceType === "affiliate" && Boolean(product.purchaseUrl);

  return (
    <>
      <RecentlyViewedTracker product={product} />
      <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/" className="mb-6 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200">
          Back to marketplace
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <ProductImageGallery images={galleryImages} alt={imageMetadata.image_alt} />

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">{product.category}</p>
            {product.subcategory ? <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-zinc-400">{product.subcategory}</p> : null}
            <h1 className="mt-3 text-4xl font-semibold text-white">{product.title}</h1>
            <div className="mt-4 flex items-center gap-3 text-sm text-zinc-300">
              <span className="rounded-full border border-amber-300/35 bg-amber-300/10 px-2 py-1 text-[10px] uppercase tracking-[0.26em] text-amber-100">{product.condition}</span>
              <span>{product.storeName}</span>
            </div>

            <div className="mt-6 flex items-end justify-between gap-3">
              <div>
                <p className="text-3xl font-semibold text-amber-300">${product.price.toFixed(2)}</p>
                {product.freeShipping ? <p className="mt-2 text-xs uppercase tracking-[0.28em] text-emerald-200">Free shipping</p> : null}
              </div>
              <p className="text-sm text-zinc-300">{product.inStock ? `${product.inventory} in stock` : "Out of stock"}</p>
            </div>

            <p className="mt-6 text-base leading-7 text-zinc-200">{product.description}</p>

            <div className="mt-6 grid gap-4 text-sm text-zinc-300 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-3">Brand: {product.brand}</div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-3">Seller: {product.storeName}</div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-3">Condition: {product.condition}</div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-3">Shipping: {product.freeShipping ? "Free" : `$${product.shippingPrice.toFixed(2)}`}</div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-3">Source: {product.sourceType ?? "storefront"}</div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-3">Authenticity: {product.authenticityStatus ?? "not_required"}</div>
              {product.year ? <div className="rounded-2xl border border-white/10 bg-black/25 p-3">Year: {product.year}</div> : null}
              {product.metal ? <div className="rounded-2xl border border-white/10 bg-black/25 p-3">Metal: {product.metal}</div> : null}
              {product.karat ? <div className="rounded-2xl border border-white/10 bg-black/25 p-3">Karat: {product.karat}</div> : null}
              {product.weight ? <div className="rounded-2xl border border-white/10 bg-black/25 p-3">Weight: {product.weight}</div> : null}
              {product.chainLength ? <div className="rounded-2xl border border-white/10 bg-black/25 p-3">Chain length: {product.chainLength}</div> : null}
              {product.chainWidth ? <div className="rounded-2xl border border-white/10 bg-black/25 p-3">Chain width: {product.chainWidth}</div> : null}
              {product.stone ? <div className="rounded-2xl border border-white/10 bg-black/25 p-3">Stone: {product.stone}</div> : null}
              {product.diamondType ? <div className="rounded-2xl border border-white/10 bg-black/25 p-3">Diamond type: {product.diamondType}</div> : null}
              {product.caratWeight ? <div className="rounded-2xl border border-white/10 bg-black/25 p-3">Carat weight: {product.caratWeight}</div> : null}
              {product.certification ? <div className="rounded-2xl border border-white/10 bg-black/25 p-3">Certification: {product.certification}</div> : null}
            </div>

            {isAffiliateItem ? (
              <div className="mt-8 rounded-2xl border border-amber-300/35 bg-amber-300/10 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-amber-100">Affiliate listing</p>
                <p className="mt-2 text-sm text-zinc-200">This product is sold by an external partner and uses partner checkout.</p>
                <Link
                  href={product.purchaseUrl as string}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-amber-300 px-5 py-3 text-sm font-bold uppercase tracking-[0.26em] text-black"
                >
                  Buy from partner
                </Link>
              </div>
            ) : (
              <MarketplaceProductActions product={product} />
            )}
          </div>
        </div>

        <section className="mt-12">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.4em] text-amber-200/80">Related products</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">More from this category</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((item) => {
              const relatedImage = resolveProductImage({
                id: item.id,
                title: item.title,
                category: item.category,
                brand: item.brand,
                image: item.image,
                imageSource: item.imageSource,
              });

              return (
              <Link key={item.id} href={`/product/${item.id}`} className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04]"> 
                <img src={relatedImage.primary_image_url} alt={relatedImage.image_alt} className="h-52 w-full object-cover" />
                <div className="p-4">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-amber-200/80">{item.category}</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
                  <div className="mt-3 flex items-center justify-between text-sm text-zinc-300">
                    <span>{item.storeName}</span>
                    <span className="text-amber-300">${item.price.toFixed(2)}</span>
                  </div>
                </div>
              </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
    </>
  );
}
