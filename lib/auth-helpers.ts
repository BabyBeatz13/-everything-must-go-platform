"use client";

import { isSupabaseConfigured, supabase } from "./supabase";

export type AuthMode = "signup" | "login" | "reset";

export async function createDemoSession(email: string, name: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    "emg-account-session",
    JSON.stringify({
      email,
      name,
      authenticated: true,
      source: isSupabaseConfigured() ? "supabase" : "demo",
    }),
  );
}

export async function handleSupabaseAuth(
  mode: AuthMode,
  email: string,
  password: string,
  name?: string,
) {
  if (!isSupabaseConfigured()) {
    await createDemoSession(email, name ?? email.split("@")[0]);
    return { ok: true, mode: "demo" as const };
  }

  if (mode === "signup") {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name ?? email.split("@")[0] },
      },
    });

    if (error) {
      throw error;
    }
  }

  if (mode === "login") {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
  }

  if (mode === "reset") {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      throw error;
    }
  }

  await createDemoSession(email, name ?? email.split("@")[0]);
  return { ok: true, mode: "supabase" as const };
}
