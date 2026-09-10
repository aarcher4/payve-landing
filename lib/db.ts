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
      // Render's external connection strings require TLS but present a certificate chain
      // Node does not ship a root for. Internal (in-region) URLs need no TLS at all.
      ssl: /sslmode=require/.test(url) ? { rejectUnauthorized: false } : undefined,
    });
    pool.on("error", (err) => {
      // An idle client erroring must never take the process down.
      console.error("[db] idle client error:", err.message);
    });
  }
  return pool;
}
