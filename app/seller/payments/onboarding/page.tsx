"use client";

import { useEffect } from "react";

export default function SellerPaymentsOnboardingPage() {
  useEffect(() => {
    window.location.href = "/seller/payments";
  }, []);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] p-8 text-sm uppercase tracking-[0.3em] text-amber-100">
      Redirecting to seller payments setup...
    </main>
  );
}
