"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type AccountSession = {
  email: string;
  name: string;
  authenticated: boolean;
};

export function UserMenu() {
  const [session, setSession] = useState<AccountSession | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem("emg-account-session");
    if (!raw) {
      setSession(null);
      return;
    }

    try {
      setSession(JSON.parse(raw) as AccountSession);
    } catch {
      setSession(null);
    }
  }, []);

  if (!session?.authenticated) {
    return (
      <Link
        href="/login"
        className="rounded-full border border-amber-300/40 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-300/20"
      >
        Login
      </Link>
    );
  }

  return (
    <div className="relative">
      <details className="group relative">
        <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-300 text-[11px] font-black text-black">
            {session.name.slice(0, 2).toUpperCase()}
          </span>
          <span className="hidden sm:inline">{session.name}</span>
        </summary>
        <div className="absolute right-0 top-full mt-2 w-52 rounded-[20px] border border-white/10 bg-black/90 p-2 shadow-lg">
          <Link href="/account" className="block rounded-xl px-3 py-2 text-sm text-zinc-200 hover:bg-white/[0.04] hover:text-amber-100">
            Dashboard
          </Link>
          <Link href="/account/profile" className="block rounded-xl px-3 py-2 text-sm text-zinc-200 hover:bg-white/[0.04] hover:text-amber-100">
            Profile Settings
          </Link>
          <Link href="/account/addresses" className="block rounded-xl px-3 py-2 text-sm text-zinc-200 hover:bg-white/[0.04] hover:text-amber-100">
            Saved Addresses
          </Link>
          <Link href="/account/wishlist" className="block rounded-xl px-3 py-2 text-sm text-zinc-200 hover:bg-white/[0.04] hover:text-amber-100">
            Wishlist
          </Link>
          <button
            type="button"
            onClick={() => {
              window.localStorage.removeItem("emg-account-session");
              window.location.href = "/";
            }}
            className="mt-2 w-full rounded-xl bg-amber-300 px-3 py-2 text-left text-sm font-semibold text-black"
          >
            Sign Out
          </button>
        </div>
      </details>
    </div>
  );
}
