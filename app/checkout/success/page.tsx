import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-[30px] border border-white/10 bg-white/[0.04] p-8 text-center sm:p-10">
        <p className="text-xs uppercase tracking-[0.36em] text-emerald-200">Checkout submitted</p>
        <h1 className="mt-3 text-3xl font-semibold">Payment confirmation pending</h1>
        <p className="mt-4 text-zinc-300">
          Your order is being confirmed by Stripe webhook events. This page does not mark payment as paid by itself.
        </p>
        <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-amber-100/80">Stripe test mode</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/account/orders" className="rounded-full bg-amber-300 px-5 py-3 text-sm font-bold uppercase tracking-[0.24em] text-black">
            View orders
          </Link>
          <Link href="/" className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold uppercase tracking-[0.24em] text-white">
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
