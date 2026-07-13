#!/usr/bin/env node
/**
 * Network-rebrand verify gate (goal-loop). Exits non-zero on any failure.
 *   1. next build
 *   2. next start :3100 + scripts/walk.mjs (all routes, 1440/390, zero console errors)
 *   3. redirect assertions: old product URLs -> new product URLs
 *   4. banned-words grep over app/ + public/llms.txt
 *   5. absolute-free-claim grep (softer fee framing is a locked decision)
 * Run: node scripts/verify-rebrand.mjs   [--skip-build to iterate on checks only]
 */
import { spawn, spawnSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const PORT = 3100;
const BASE = `http://localhost:${PORT}`;
const SKIP_BUILD = process.argv.includes("--skip-build");
let failures = 0;
const fail = (msg) => { failures++; console.log(`GATE FAIL: ${msg}`); };
const ok = (msg) => console.log(`gate ok: ${msg}`);

// ---------- 4+5. static copy checks (cheap, run first) ----------
const BANNED = [
  /seamless/i, /frictionless/i, /revolutioniz/i, /reimagin/i, /\becosystem/i,
  /next-generation/i, /cutting-edge/i, /empower/i, /network effects/i,
];
const FREE_CLAIMS = [
  /for free\b/i, /zero fees/i, /no transaction costs?/i, /100% free/i, /\$0(?=[^\d.]|$)/,
];
function* walkFiles(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walkFiles(p);
    else if (/\.(tsx?|mdx?|txt)$/.test(name)) yield p;
  }
}
const copyFiles = [...walkFiles(join(ROOT, "app")), join(ROOT, "public", "llms.txt")];
for (const f of copyFiles) {
  const text = readFileSync(f, "utf8");
  for (const re of BANNED) {
    const m = text.match(re);
    if (m) fail(`banned word "${m[0]}" in ${f}`);
  }
  for (const re of FREE_CLAIMS) {
    const m = text.match(re);
    if (m) fail(`absolute free-claim "${m[0]}" in ${f} (locked decision: softer framing)`);
  }
  if (/global account/i.test(text)) fail(`"global account" in ${f} (r2: say "operating account")`);
  // r2 copy style: no em dashes in copy. Comment lines are exempt.
  const copyLines = text
    .split("\n")
    .filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l));
  const dashLine = copyLines.find((l) => /—|&mdash;/.test(l));
  if (dashLine) fail(`em dash in copy in ${f}: "${dashLine.trim().slice(0, 80)}"`);
}
if (!failures) ok("banned-words + free-claim + em-dash + operating-account greps clean");

// ---------- 1. build ----------
if (!SKIP_BUILD) {
  console.log("gate: next build ...");
  const build = spawnSync("npx next build", { cwd: ROOT, shell: true, stdio: "inherit", timeout: 600000 });
  if (build.status !== 0) {
    fail(`next build exited ${build.status}`);
    console.log(`GATE RESULT: FAIL (${failures})`);
    process.exit(1); // no point starting the server
  }
  ok("build exit 0");
}

// ---------- 2+3. server-dependent checks ----------
console.log("gate: starting next start ...");
const server = spawn("npx next start -p " + PORT, { cwd: ROOT, shell: true, stdio: "pipe" });
const killServer = () => {
  if (process.platform === "win32") spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" });
  else server.kill("SIGKILL");
};
process.on("exit", killServer);

const up = await (async () => {
  for (let i = 0; i < 60; i++) {
    try { const r = await fetch(BASE + "/", { redirect: "manual" }); if (r.status) return true; }
    catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
})();
if (!up) {
  fail("server did not come up on :3100 within 60s");
  console.log(`GATE RESULT: FAIL (${failures})`);
  process.exit(1);
}

// redirects (assert BEFORE walk so a broken redirect is named precisely)
const REDIRECTS = [
  ["/products/payments", "/products/network"],
  ["/products/early-pay", "/products/network"],
  ["/products/agents", "/products/agentic-intelligence"],
];
for (const [from, to] of REDIRECTS) {
  const r = await fetch(BASE + from, { redirect: "manual" });
  const loc = r.headers.get("location") || "";
  if (![301, 302, 307, 308].includes(r.status)) fail(`${from}: expected redirect, got ${r.status}`);
  else if (!loc.endsWith(to)) fail(`${from}: redirects to "${loc}", expected ${to}`);
  else ok(`${from} -> ${to} (${r.status})`);
}

// full walk
const walk = spawnSync(`node scripts/walk.mjs --base ${BASE}`, { cwd: ROOT, shell: true, stdio: "inherit", timeout: 600000 });
if (walk.status !== 0) fail(`walk.mjs exited ${walk.status}`);
else ok("walk CLEAN");

killServer();
console.log(failures ? `GATE RESULT: FAIL (${failures})` : "GATE RESULT: PASS");
process.exit(failures ? 1 : 0);
