"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Link href="/admin/users" className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200">Back to users</Link>
        </div>

        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">User profile</p>
          <h1 className="mt-2 text-3xl font-semibold">{params.id}</h1>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Account</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-200">
                <li>Role: customer</li>
                <li>Signup date: 2026-08-11</li>
                <li>Status: active</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Admin actions</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" className="rounded-full border border-amber-300/40 bg-amber-300/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-100">Mark for review</button>
                <button type="button" className="rounded-full border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-200">Suspend</button>
                <button type="button" className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200">Unsuspend</button>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Internal admin notes</p>
            <textarea className="mt-3 min-h-24 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none" placeholder="Add internal notes. Sensitive credential and payment details are not shown." />
          </div>
        </div>
      </div>
    </main>
  );
}
