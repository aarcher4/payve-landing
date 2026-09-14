/**
 * The operator session for /rates/settings.
 *
 * A single shared password, exchanged for a signed, httpOnly cookie. Deliberately not a user
 * system: this gates a handful of people changing five numbers, and every change is already
 * attributed by the required reason and the append-only history. Building identity here would
 * be more surface than the thing it protects.
 *
 * SIGNING USES WEB CRYPTO, NOT `node:crypto`. Middleware runs on the Edge runtime, where
 * `createHmac` does not exist — so verification, which is what middleware needs, is written
 * against `crypto.subtle`, which is present in both runtimes. Password comparison stays in the
 * Node-only API route where a constant-time compare is available.
 *
 * The cookie carries only an expiry. There is no identity to carry, and putting anything else
 * in it would invite treating an unauthenticated string as data.
 */

const COOKIE_NAME = "payve_rates_session";
const TTL_MS = 12 * 60 * 60_000;

export { COOKIE_NAME };

function b64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Returns a Uint8Array backed by a plain ArrayBuffer. The explicit buffer allocation is not
 * decoration: `Uint8Array.from` is typed as `ArrayBufferLike`, which may be a SharedArrayBuffer,
 * and `crypto.subtle` will not accept one.
 */
function fromB64url(s: string): Uint8Array<ArrayBuffer> {
  const pad = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(pad + "=".repeat((4 - (pad.length % 4)) % 4));
  const out = new Uint8Array(new ArrayBuffer(bin.length));
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function secret(): string | null {
  const s = process.env.RATES_SESSION_SECRET;
  // A short secret is not a secret. Refuse rather than sign with something guessable.
  return s && s.length >= 16 ? s : null;
}

async function key(): Promise<CryptoKey | null> {
  const s = secret();
  if (!s) return null;
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(s),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

/** Mint a session token valid for TTL_MS. Null when no usable secret is configured. */
export async function mintSession(now = Date.now()): Promise<string | null> {
  const k = await key();
  if (!k) return null;
  const payload = b64url(new TextEncoder().encode(JSON.stringify({ exp: now + TTL_MS })));
  const sig = await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(payload));
  return `${payload}.${b64url(new Uint8Array(sig))}`;
}

/**
 * Verify a session token. Returns false for anything that is not a live, correctly-signed,
 * unexpired token — including a missing secret, so a misconfigured deploy locks the settings
 * page rather than opening it.
 */
export async function verifySession(token: string | undefined | null, now = Date.now()): Promise<boolean> {
  if (!token) return false;
  const k = await key();
  if (!k) return false;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  try {
    // subtle.verify is constant-time, so this comparison does not leak the signature.
    const ok = await crypto.subtle.verify(
      "HMAC",
      k,
      fromB64url(sig),
      new TextEncoder().encode(payload),
    );
    if (!ok) return false;
    const body = JSON.parse(new TextDecoder().decode(fromB64url(payload))) as { exp?: number };
    return typeof body.exp === "number" && body.exp > now;
  } catch {
    return false;
  }
}

export function sessionCookie(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    // Never readable from JavaScript, never sent cross-site, never over plain HTTP in
    // production. `lax` still allows the redirect back from the login form.
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(TTL_MS / 1000),
  };
}

export function clearedCookie() {
  return { ...sessionCookie(""), maxAge: 0 };
}
