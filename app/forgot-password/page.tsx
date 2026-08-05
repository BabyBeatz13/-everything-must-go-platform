"use client";

import { useState } from "react";
import { AuthCard } from "../../components/auth/AuthCard";
import { handleSupabaseAuth } from "../../lib/auth-helpers";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await handleSupabaseAuth("reset", email, "");
      setMessage("Password reset instructions were prepared for your inbox.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to send reset email.");
    }
  }

  return (
    <AuthCard
      title="Reset your password"
      subtitle="Recover your marketplace account access with a secure password reset flow."
      footerLinkHref="/login"
      footerLinkText="Back to Login"
      footerHint="Remembered your password?"
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
        <button
          type="submit"
          className="w-full rounded-full bg-amber-300 px-5 py-3 text-sm font-bold uppercase tracking-[0.28em] text-black"
        >
          Send Reset Link
        </button>
      </form>
      {message ? <p className="mt-4 text-sm text-amber-100">{message}</p> : null}
    </AuthCard>
  );
}
