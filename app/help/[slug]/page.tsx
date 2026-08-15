import Link from "next/link";
import { getHelpArticleBySlug, helpArticles } from "@/lib/support";

export default async function HelpArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getHelpArticleBySlug(slug);

  if (!article) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] p-8 text-white">
        <div className="mx-auto max-w-3xl rounded-[30px] border border-white/10 bg-white/[0.04] p-6">Article not found.</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/help" className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200">Back to help center</Link>

        <article className="mt-6 rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">{article.category}</p>
          <h1 className="mt-2 text-3xl font-semibold">{article.title}</h1>
          <p className="mt-4 text-zinc-300">{article.summary}</p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-7 text-zinc-200">{article.body}</div>
        </article>

        <div className="mt-6 rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-[10px] uppercase tracking-[0.38em] text-amber-200/80">More articles</p>
          <div className="mt-4 space-y-3">
            {helpArticles.filter((item) => item.id !== article.id).slice(0, 3).map((item) => (
              <Link key={item.id} href={`/help/${item.slug}`} className="block rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-zinc-200">{item.title}</Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
