#!/usr/bin/env node
/**
 * Apply db/*.sql in filename order, once each, under an advisory lock.
 *
 * Runs from `npm start` before `next start`, so merging is how a schema change ships — there
 * is no manual apply step to forget. Mirrors the payments app's runner.
 *
 * Four properties, each load-bearing:
 *
 *  1. NO-OP WITHOUT A DATABASE. `DATABASE_URL` unset exits 0 immediately. The rates surface is
 *     designed to run without a database, so a missing one is a configuration, not a fault —
 *     and `npm start` must not refuse to boot the site over it.
 *  2. FAIL-CLOSED WITH ONE. If a database IS configured and a migration fails, exit non-zero
 *     and do not start the server. Serving a rate board against a half-migrated schema is
 *     worse than not serving it.
 *  3. ONE FILE, ONE TRANSACTION. A failed migration leaves nothing behind, so a redeploy
 *     retries cleanly rather than resuming from an unknown midpoint.
 *  4. ADVISORY LOCK. Render overlaps old and new instances during a deploy. Without the lock,
 *     two boots race the same migration.
 *
 *   node scripts/migrate.mjs
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";

const DIR = "db";
/** Arbitrary but stable: any constant works, as long as every instance uses the same one. */
const LOCK_KEY = 8_275_413;

const url = process.env.DATABASE_URL;
if (!url) {
  console.log("[migrate] DATABASE_URL unset — skipping (the rates surface runs without one)");
  process.exit(0);
}

let files = [];
try {
  files = readdirSync(DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();
} catch {
  console.log(`[migrate] no ${DIR}/ directory — nothing to apply`);
  process.exit(0);
}

const client = new pg.Client({
  connectionString: url,
  ssl: /sslmode=require/.test(url) ? { rejectUnauthorized: false } : undefined,
});

let applied = 0;
try {
  await client.connect();
  await client.query("select pg_advisory_lock($1)", [LOCK_KEY]);

  // Bootstrap the ledger itself before consulting it: on a virgin database 001 is what
  // creates this table, so it cannot be the thing we query to decide whether to run 001.
  await client.query(`
    create table if not exists schema_migrations (
      name       text primary key,
      applied_at timestamptz not null default now()
    )`);

  const { rows } = await client.query("select name from schema_migrations");
  const done = new Set(rows.map((r) => r.name));

  for (const file of files) {
    if (done.has(file)) continue;
    const sql = readFileSync(join(DIR, file), "utf8");
    process.stdout.write(`[migrate] applying ${file} … `);
    try {
      await client.query("begin");
      await client.query(sql);
      await client.query("insert into schema_migrations (name) values ($1)", [file]);
      await client.query("commit");
      applied++;
      console.log("ok");
    } catch (err) {
      await client.query("rollback").catch(() => {});
      console.log("FAILED");
      console.error(`[migrate] ${file}: ${err instanceof Error ? err.message : String(err)}`);
      throw err;
    }
  }

  console.log(`[migrate] ${applied} applied, ${files.length - applied} already present`);
} catch (err) {
  console.error("[migrate] aborting boot:", err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
} finally {
  await client.query("select pg_advisory_unlock($1)", [LOCK_KEY]).catch(() => {});
  await client.end().catch(() => {});
}
