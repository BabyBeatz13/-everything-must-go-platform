"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getCurrentUserRole } from "@/lib/client-auth";

type UserRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  created_at: string | null;
  is_suspended: boolean | null;
};

export default function AdminUsersPage() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserRow[]>([]);

  useEffect(() => {
    void (async () => {
      const role = await getCurrentUserRole();
      if (role !== "admin") {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      setAuthorized(true);
      const { data } = await supabase.from("profiles").select("id, email, full_name, role, created_at, is_suspended").order("created_at", { ascending: false }).limit(100);
      setUsers((data as UserRow[]) ?? []);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] p-8 text-sm uppercase tracking-[0.3em] text-amber-100">Loading users...</main>;
  }

  if (!authorized) {
    return <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] p-8 text-sm uppercase tracking-[0.3em] text-rose-200">Unauthorized: admin access required.</main>;
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Admin users</p>
          <h1 className="mt-2 text-3xl font-semibold">User management</h1>
        </div>

        <div className="mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-black/30">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-white/[0.02] text-zinc-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-white/5">
                    <td className="px-4 py-3 text-zinc-200">{user.full_name || "Unassigned"}</td>
                    <td className="px-4 py-3 text-zinc-200">{user.email || "Hidden"}</td>
                    <td className="px-4 py-3 text-zinc-200">{user.role || "customer"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.2em] ${user.is_suspended ? "border-rose-500/40 bg-rose-500/10 text-rose-200" : "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"}`}>
                        {user.is_suspended ? "Suspended" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
