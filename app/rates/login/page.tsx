"use client";

import { useState } from "react";

/**
 * The settings gate. One shared password, exchanged for a signed httpOnly cookie.
 *
 * Failures are deliberately uniform: a wrong password and a throttled address say what
 * happened, but nothing distinguishes "no such password configured" from "wrong password" in a
 * way that would confirm the page is live and mis-configured.
 */
export default function RateLoginPage() {
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/rates/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        window.location.href = "/rates/settings";
        return;
      }
      const body = await res.json().catch(() => ({}));
      setErr(
        body.error === "too_many_attempts"
          ? "Too many attempts. Wait a minute and try again."
          : body.error === "not_configured"
            ? "Settings are not configured on this deployment."
            : "That password is not right.",
      );
    } catch {
      setErr("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-r-bg px-4 text-r-fg">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-r-md border border-r-border bg-r-card p-6"
      >
        <h1 className="font-display text-xl font-medium tracking-h1">Rate settings</h1>
        <p className="mt-1.5 text-sm text-r-muted-fg">
          Operator access. The public rate board needs no sign in.
        </p>

        <label htmlFor="password" className="mt-6 block text-xs font-semibold uppercase tracking-[0.04em] text-r-muted-fg">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          data-password
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 h-control w-full rounded-r-sm border border-r-border bg-r-bg px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-r-ring"
        />

        {err && (
          <p className="mt-3 text-sm text-r-destructive" data-login-error>
            {err}
          </p>
        )}

        <button
          type="submit"
          disabled={busy || password.length === 0}
          className="mt-5 h-control w-full rounded-r-sm bg-r-primary px-4 text-sm font-semibold text-r-primary-fg transition-opacity disabled:opacity-40"
        >
          {busy ? "Checking…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
