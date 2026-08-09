"use client";

import { isSupabaseConfigured, supabase } from "./supabase";

export type LocalAccountSession = {
  email: string;
  name?: string;
  authenticated: boolean;
};

export function getLocalAccountSession() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("emg-account-session");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as LocalAccountSession;
  } catch {
    return null;
  }
}

export async function getSupabaseAccessToken() {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase.auth.getSession();
  if (error) return null;

  return data.session?.access_token ?? null;
}

export async function getAuthenticatedSupabaseUser() {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  return data.user;
}

export async function getCurrentUserRole() {
  const user = await getAuthenticatedSupabaseUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data?.role) return null;
  return String(data.role);
}

export async function getCurrentSellerProfile() {
  const user = await getAuthenticatedSupabaseUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("seller_profiles")
    .select("*")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (error || !data) return null;
  return data as Record<string, unknown>;
}
