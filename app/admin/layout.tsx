"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { getCurrentUserRole } from "@/lib/client-auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    void (async () => {
      const role = await getCurrentUserRole();
      setAuthorized(role === "admin");
    })();
  }, []);

  if (authorized === null) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] p-8 text-sm uppercase tracking-[0.3em] text-amber-100">
        Checking admin access...
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] p-8 text-sm uppercase tracking-[0.3em] text-rose-200">
        Unauthorized: admin access required.
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <AdminShell />
      <div className="flex-1">{children}</div>
    </div>
  );
}
