"use client";

const reviews = [
  { id: "rvw-1", title: "Luxury handbag review", author: "M. Chen", rating: 5, status: "published" },
  { id: "rvw-2", title: "Seller response quality", author: "J. Smith", rating: 2, status: "flagged" },
  { id: "rvw-3", title: "Shipping experience", author: "B. Allen", rating: 1, status: "removed" },
];

export default function AdminReviewsPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-amber-300/20 bg-white/[0.03] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Admin reviews</p>
          <h1 className="mt-2 text-3xl font-semibold">Review moderation</h1>
        </div>

        <div className="mt-6 space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-[24px] border border-white/10 bg-black/30 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-white">{review.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-zinc-500">{review.author} • {review.rating}/5</p>
                </div>
                <span className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${review.status === "published" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : review.status === "flagged" ? "border-amber-500/30 bg-amber-500/10 text-amber-200" : "border-rose-500/30 bg-rose-500/10 text-rose-200"}`}>
                  {review.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
