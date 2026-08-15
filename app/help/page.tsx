import Link from "next/link";
import { helpArticles } from "@/lib/support";

const categories = [
  "Buying",
  "Selling",
  "Payments",
  "Shipping",
  "Returns",
  "Refunds",
  "Authentication & luxury goods",
  "Account security",
  "Seller verification",
  "Customer Protection",
  "Tracking",
  "Jewelry buying guide",
  "Designer handbag authenticity",
  "Collectibles",
  "Garden/seeds",
  "Studio equipment",
];

export default function HelpCenterPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Help center</p>
          <h1 className="mt-2 text-3xl font-semibold">Search the knowledge base</h1>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div key={category} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-200">
              {category}
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-amber-200/80">Popular articles</p>
          <div className="mt-4 space-y-3">
            {helpArticles.map((article) => (
              <Link key={article.id} href={`/help/${article.slug}`} className="block rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="font-semibold text-white">{article.title}</p>
                <p className="mt-1 text-sm text-zinc-300">{article.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
