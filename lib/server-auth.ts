import { createAnonServerSupabase } from "./supabase-server";

export function getBearerTokenFromRequest(request: Request) {
  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
  if (!authHeader) return null;

  const [type, token] = authHeader.split(" ");
  if (type?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}

export async function getAuthenticatedUserFromRequest(request: Request) {
  const token = getBearerTokenFromRequest(request);
  if (!token) return null;

  const supabase = createAnonServerSupabase();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return null;
  }

  return {
    token,
    user: data.user,
  };
}

export async function getUserRoleFromAccessToken(accessToken: string) {
  const supabase = createAnonServerSupabase();
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user?.id) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError || !profile?.role) {
    return null;
  }

  return String(profile.role);
}
