/**
 * Log in and out of the settings page.
 *
 * Password comparison lives here rather than in `lib/session.ts` because this route runs on
 * Node, where a constant-time compare is available. Middleware only ever VERIFIES a signature,
 * which Web Crypto does in both runtimes.
 */
import { timingSafeEqual } from "node:crypto";
import { clearedCookie, mintSession, sessionCookie } from "@/lib/session";

/**
 * A tiny in-process throttle. One instance, one shared password, so a fixed window keyed on
 * the client address is enough to turn an online guessing attack into an impractical one. It
 * is not a substitute for a strong password, and the deploy runbook says so.
 */
const ATTEMPT_WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 8;
const attempts = new Map<string, { count: number; since: number }>();

function throttled(ip: string): boolean {
  const now = Date.now();
  const hit = attempts.get(ip);
  if (!hit || now - hit.since > ATTEMPT_WINDOW_MS) {
    attempts.set(ip, { count: 1, since: now });
    return false;
  }
  hit.count++;
  return hit.count > MAX_ATTEMPTS;
}

/** Constant-time compare that does not leak the password's length through an early return. */
function passwordMatches(supplied: string, expected: string): boolean {
  const a = new TextEncoder().encode(supplied);
  const b = new TextEncoder().encode(expected);
  // timingSafeEqual throws on a length mismatch, so pad both to the same fixed width first.
  const len = Math.max(a.length, b.length, 64);
  const pa = new Uint8Array(len);
  const pb = new Uint8Array(len);
  pa.set(a);
  pb.set(b);
  return timingSafeEqual(pa, pb) && a.length === b.length;
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("action") === "logout") {
    return Response.json({ ok: true }, { headers: setCookie(clearedCookie()) });
  }

  const expected = process.env.RATES_ADMIN_PASSWORD;
  const secretConfigured = Boolean(process.env.RATES_SESSION_SECRET);
  // A missing password or secret LOCKS the page. A misconfigured deploy must never be the
  // thing that opens the spread editor to the internet.
  if (!expected || !secretConfigured) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (throttled(ip)) {
    return Response.json({ error: "too_many_attempts" }, { status: 429 });
  }

  let supplied = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    supplied = typeof body.password === "string" ? body.password : "";
  } catch {
    supplied = "";
  }

  if (!passwordMatches(supplied, expected)) {
    return Response.json({ error: "invalid_password" }, { status: 401 });
  }

  const token = await mintSession();
  if (!token) return Response.json({ error: "not_configured" }, { status: 503 });
  return Response.json({ ok: true }, { headers: setCookie(sessionCookie(token)) });
}

function setCookie(c: ReturnType<typeof sessionCookie>): HeadersInit {
  const parts = [
    `${c.name}=${c.value}`,
    `Path=${c.path}`,
    `Max-Age=${c.maxAge}`,
    `SameSite=${c.sameSite === "lax" ? "Lax" : "Strict"}`,
    "HttpOnly",
  ];
  if (c.secure) parts.push("Secure");
  return { "Set-Cookie": parts.join("; ") };
}

export const dynamic = "force-dynamic";
