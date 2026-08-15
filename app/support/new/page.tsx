"use client";

import { useState } from "react";
import Link from "next/link";
import { supportCategories, supportPriorities } from "@/lib/support";

export default function SupportNewPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/support" className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200">Back to support</Link>

        <div className="mt-6 rounded-[30px] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Open support ticket</p>
          <h1 className="mt-2 text-3xl font-semibold">Request help</h1>

          {submitted ? (
            <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
              Your ticket has been created and a member of support will review it soon.
            </div>
          ) : null}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
            className="mt-6 space-y-5"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <label className="text-xs uppercase tracking-[0.24em] text-zinc-400">
                Issue category
                <select className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none">
                  {supportCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>

              <label className="text-xs uppercase tracking-[0.24em] text-zinc-400">
                Priority
                <select className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none">
                  {supportPriorities.map((priority) => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block text-xs uppercase tracking-[0.24em] text-zinc-400">
              Subject
              <input
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none"
                placeholder="Brief summary of the problem"
              />
            </label>

            <label className="block text-xs uppercase tracking-[0.24em] text-zinc-400">
              Description
              <textarea
                className="mt-2 min-h-32 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none"
                placeholder="Tell us what happened, including order details if relevant."
              />
            </label>

            <label className="block text-xs uppercase tracking-[0.24em] text-zinc-400">
              Attach evidence
              <input
                type="file"
                multiple
                className="mt-2 block w-full rounded-2xl border border-dashed border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-300"
              />
            </label>

            <div className="flex flex-wrap justify-between gap-3 pt-2">
              <button type="button" className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white">Save draft</button>
              <button type="submit" className="rounded-full bg-amber-300 px-5 py-3 text-xs font-bold uppercase tracking-[0.24em] text-black">Submit ticket</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
