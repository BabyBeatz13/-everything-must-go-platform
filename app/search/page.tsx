import { Suspense } from "react";
import SearchResultsContent from "@/components/search/SearchResultsContent";

export default function SearchResultsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-100">Loading search results...</p>
          </div>
        </main>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}
