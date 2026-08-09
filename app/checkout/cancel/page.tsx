import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-[30px] border border-white/10 bg-white/[0.04] p-8 text-center sm:p-10">
        <p className="text-xs uppercase tracking-[0.36em] text-amber-200/80">Checkout cancelled</p>
        <h1 className="mt-3 text-3xl font-semibold">Your cart is still saved</h1>
        <p className="mt-4 text-zinc-300">No payment was completed. You can return to checkout at any time.</p>
        <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-amber-100/80">Stripe test mode</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/checkout" className="rounded-full bg-amber-300 px-5 py-3 text-sm font-bold uppercase tracking-[0.24em] text-black">
            Return to checkout
          </Link>
          <Link href="/cart" className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold uppercase tracking-[0.24em] text-white">
            Back to cart
          </Link>
        </div>
      </div>
    </main>
  );
}
