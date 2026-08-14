import { getCurrentUserRole } from "@/lib/client-auth";

export async function ensureAdminAccess() {
  const role = await getCurrentUserRole();
  return role === "admin";
}

export async function getAdminStatus() {
  const role = await getCurrentUserRole();
  return {
    isAdmin: role === "admin",
    role,
  };
}
