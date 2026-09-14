/**
 * Postgres access for the rates surface.
 *
 * The database is OPTIONAL by design. With `DATABASE_URL` unset the whole app behaves exactly
 * as it did before one existed: spreads come from `PAYVE_PUBLIC_SPREAD_BPS`, history is empty,
 * and the rate board still publishes live Bridge rates. That keeps local dev, previews, and
 * the currently-deployed production service working without provisioning anything, and it
 * means this branch is deployable before the database exists.
 *
 * `getPool()` returns null rather than throwing when unconfigured, so every caller is forced
 * to write the no-database branch explicitly instead of discovering it as a 500 in production.
 */
import { Pool } from "pg";

/**
 * TLS is ON for every host except an explicitly local one.
 *
 * Opting IN on `sslmode=require` was the first implementation and it was wrong: Render's
 * external connection string does not carry that parameter, yet the server demands TLS, so the
 * connection died with ECONNRESET - a failure that reads like a network problem rather than a
 * missing option. Defaulting to TLS and opting OUT for localhost is both safer and correct for
 * every managed provider.
 *
 * `rejectUnauthorized: false` because managed providers present chains Node ships no root for.
 * That is the standard configuration for them, and the connection string itself is the secret.
 */
function sslFor(url: string): { rejectUnauthorized: boolean } | undefined {
  if (/sslmode=disable/.test(url)) return undefined;
  const host = (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return "";
    }
  })();
  const local = host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "";
  return local ? undefined : { rejectUnauthorized: false };
}

let pool: Pool | null = null;

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool(): Pool | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: url,
      // A marketing box with one instance does not need a wide pool, and Render's smaller
      // Postgres plans have a low connection ceiling that a default pool will happily eat.
      max: 4,
      idleTimeoutMillis: 30_000,
      // Never let a slow database hold a page render. The callers all degrade gracefully.
      connectionTimeoutMillis: 5_000,
      ssl: sslFor(url),
    });
    pool.on("error", (err) => {
      // An idle client erroring must never take the process down.
      console.error("[db] idle client error:", err.message);
    });
  }
  return pool;
}
