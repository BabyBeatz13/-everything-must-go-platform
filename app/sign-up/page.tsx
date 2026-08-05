"use client";

import { useState } from "react";
import { AuthCard } from "../../components/auth/AuthCard";
import { handleSupabaseAuth } from "../../lib/auth-helpers";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await handleSupabaseAuth("signup", email, password, name);
      setMessage("Account created. You can now enter the marketplace workspace.");
      window.location.href = "/account";
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create account.");
    }
  }

  return (
    <AuthCard
      title="Create your customer account"
      subtitle="Join the marketplace-ready account system for wishlist management, saved carts, recent history, and future seller expansion."
      footerLinkHref="/login"
      footerLinkText="Login"
      footerHint="Already a member?"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block text-sm text-zinc-300">
          Full name
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none"
            placeholder="Your name"
          />
        </label>
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
            placeholder="Minimum 8 characters"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-full bg-amber-300 px-5 py-3 text-sm font-bold uppercase tracking-[0.28em] text-black"
        >
          Sign Up
        </button>
      </form>
      {message ? <p className="mt-4 text-sm text-amber-100">{message}</p> : null}
    </AuthCard>
  );
}
