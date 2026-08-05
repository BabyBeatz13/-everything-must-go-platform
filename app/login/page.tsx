"use client";

import { useState } from "react";
import { AuthCard } from "../../components/auth/AuthCard";
import { handleSupabaseAuth } from "../../lib/auth-helpers";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await handleSupabaseAuth("login", email, password);
      setMessage("Sign in successful. Redirecting to your account dashboard.");
      window.location.href = "/account";
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to sign in.");
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Access your customer account workspace for saved carts, marketplace preferences, and personalized tracking."
      footerLinkHref="/sign-up"
      footerLinkText="Sign Up"
      footerHint="New here?"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block text-sm text-zinc-300">
          Email address
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none"
            placeholder="you@example.com"
          />
        </label>
        <label className="block text-sm text-zinc-300">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none"
            placeholder="Enter your password"
          />
        </label>
        <div className="flex items-center justify-between text-sm">
          <a href="/forgot-password" className="text-amber-100 transition hover:text-amber-300">
            Forgot password?
          </a>
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-amber-300 px-5 py-3 text-sm font-bold uppercase tracking-[0.28em] text-black"
        >
          Login
        </button>
      </form>
      {message ? <p className="mt-4 text-sm text-amber-100">{message}</p> : null}
    </AuthCard>
  );
}
