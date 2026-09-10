#!/usr/bin/env node
/**
 * Acceptance gate for /rates/working-capital.
 *
 * The rates gate only ever navigates to /rates, so without this the whole Working Capital page
 * would ship ungated. Same house shape: refuse a busy port, accumulate failures rather than
 * exiting on the first, kill the server and re-poll the port on teardown (next start spawns a
 * child of its own, so killing the wrapper alone leaves the listener bound).
 *
 * EVERYTHING IS ASSERTED UNDER reducedMotion: "reduce". That is not a convenience: the loop
 * driver seeds from useReducedMotion, so with motion off each timeline sits at its DESTINATION
 * deterministically. With motion on, the markers cycle, and an assertion would pass or fail
 * depending on which phase it happened to sample. The reduced-motion end state is also exactly
 * what a printout and a full-page screenshot capture.
 *
 *   node scripts/verify-working-capital.mjs [--port 3183]
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";

const arg = (name, dflt) => {
  const i = process.argv.indexOf(name);
  return (i >= 0 && process.argv[i + 1]) || dflt;
};
const PORT = Number(arg("--port", "3183"));
const BASE = `http://localhost:${PORT}`;
const PAGE = `${BASE}/rates/working-capital`;

const failures = [];
let passed = 0;
function assert(ok, label, detail = "") {
  if (ok) {
    passed++;
    console.log(`  ok   ${label}`);
  } else {
    console.log(`  FAIL ${label}${detail ? ` — ${detail}` : ""}`);
    failures.push(`${label}${detail ? ` — ${detail}` : ""}`);
  }
}

async function portIsBusy() {
  try {
    await fetch(BASE, { method: "HEAD", signal: AbortSignal.timeout(1500) });
    return true;
  } catch {
    return false;
  }
}
if (await portIsBusy()) {
  console.error(`[verify-working-capital] port ${PORT} is already serving — a stale server would test the wrong build.`);
  process.exit(1);
}

const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
  env: { ...process.env, NODE_ENV: "production" },
  stdio: ["ignore", "pipe", "pipe"],
  shell: process.platform === "win32",
});
let log = "";
server.stdout.on("data", (d) => (log += d.toString()));
server.stderr.on("data", (d) => (log += d.toString()));

async function shutdown() {
  try {
    if (process.platform === "win32") {
      const k = spawn("taskkill", ["/pid", String(server.pid), "/f", "/t"], { stdio: "ignore" });
      await new Promise((r) => k.on("exit", r));
    } else {
      server.kill("SIGTERM");
    }
  } catch {
    /* already gone */
  }
  for (let i = 0; i < 20; i++) {
    if (!(await portIsBusy())) return;
    await new Promise((r) => setTimeout(r, 250));
  }
}

let browser;
try {
  const deadline = Date.now() + 90_000;
  let up = false;
  while (Date.now() < deadline) {
    if (await portIsBusy()) {
      up = true;
      break;
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  if (!up) {
    console.error("[verify-working-capital] server did not start:\n" + log.slice(-2000));
    await shutdown();
    process.exit(1);
  }

  browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
  page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));

  const res = await page.goto(PAGE, { waitUntil: "networkidle" });
  assert(res && res.status() === 200, "the page returns 200", String(res && res.status()));

  console.log("\nBoth products render");
  for (const product of ["early-pay", "pay-later"]) {
    assert(
      (await page.locator(`[data-product="${product}"]`).count()) === 1,
      `${product} section renders`,
    );
    assert(
      (await page.locator(`[data-timeline="${product}"]`).count()) === 1,
      `${product} timeline renders`,
    );
  }

  console.log("\nThe two timelines tell DIFFERENT stories");
  /**
   * The assertion that would actually catch a defect. A structural "two timelines render" check
   * passes just as happily when both draw the same picture, and the contrast between them IS
   * the page. Asserted on the destination day AND on real geometry, because the attribute could
   * be right while the layout put both markers in the same place.
   */
  const dayOf = (v) =>
    page.locator(`[data-timeline="${v}"] [data-marker="moving"]`).getAttribute("data-marker-day");
  /**
   * Measure the DOT, and only after scrolling its section into view.
   *
   * Two lessons, both paid for. The marker column is a 1px rail so that the label can anchor to
   * an edge without dragging the dot off the date it names, and `boundingBox()` on an element
   * that thin, sitting below the fold, came back as the viewport centre for BOTH timelines: a
   * clean 720-vs-720 that read exactly like a layout collapse and was a measurement artifact.
   * The dot is a real 10px box, it IS the thing whose position has to be right, and scrolling
   * first is also the only condition under which the component is meant to be seen (the loop is
   * `useInView`-gated, so an unscrolled section is never in its end state anyway).
   */
  const boxOf = async (v) => {
    await page.locator(`[data-timeline="${v}"]`).scrollIntoViewIfNeeded();
    return page.locator(`[data-timeline="${v}"] [data-marker="moving"] [data-dot]`).boundingBox();
  };

  const earlyDay = await dayOf("early-pay");
  const laterDay = await dayOf("pay-later");
  assert(earlyDay === "1", "Early Pay lands the supplier on day 1", String(earlyDay));
  assert(laterDay === "60", "Pay Later pushes the buyer to day 60", String(laterDay));

  /**
   * Wait for the POSITION, not just the attribute.
   *
   * React updates `data-marker-day` on re-render, but framer applies the new `left` on the next
   * animation frame. Reading the box straight after the attribute measured both markers still
   * at 50%, one tick stale, and the failure looked exactly like a layout bug. Waiting on the
   * element's own inline style is deterministic where a fixed sleep would be a guess.
   */
  await page.waitForFunction(
    () => {
      const l = (v) =>
        document.querySelector(`[data-timeline="${v}"] [data-marker="moving"]`)?.style.left ?? "";
      // Day 1 of 60 is 1.666...%, day 60 is 100%.
      return l("early-pay").startsWith("1.6") && l("pay-later") === "100%";
    },
    { timeout: 15_000 },
  );

  const earlyBox = await boxOf("early-pay");
  const laterBox = await boxOf("pay-later");
  assert(
    Math.abs(earlyBox.x - laterBox.x) > 200,
    "the two moving markers sit far apart on screen",
    `${Math.round(earlyBox.x)} vs ${Math.round(laterBox.x)}`,
  );
  // Both pinned markers stay on the due date: that is the promise each product keeps.
  for (const v of ["early-pay", "pay-later"]) {
    const pinned = await page
      .locator(`[data-timeline="${v}"] [data-marker="pinned"]`)
      .getAttribute("data-marker-day");
    assert(pinned === "30", `${v} keeps its pinned party on day 30`, String(pinned));
  }
  // Early Pay moves LEFT of the due date, Pay Later moves RIGHT. Opposite directions is the
  // whole argument, so assert the direction rather than just the difference.
  await page.locator('[data-timeline="early-pay"]').scrollIntoViewIfNeeded();
  const pinnedBox = await page
    .locator('[data-timeline="early-pay"] [data-marker="pinned"] [data-dot]')
    .boundingBox();
  assert(earlyBox.x < pinnedBox.x, "Early Pay moves earlier than the due date");
  assert(laterBox.x > pinnedBox.x, "Pay Later moves later than the due date");

  console.log("\nThe published rates");
  const body = await page.locator("main").innerText();
  assert(/From 1\.85%/.test(body), "Early Pay publishes its floor rate");
  assert(/From 1\.77%/.test(body), "Pay Later publishes its floor rate");
  // A "from" figure without the mechanism is the misleading form: the engine charges per day,
  // so the page has to say so or a short invoice reads as overpriced.
  assert(/[Pp]riced per day/.test(body), "Early Pay states that it is priced per day");
  assert(
    /not double a 30 day one/.test(body),
    "Pay Later states that a longer term is not a multiple",
  );
  // Never an annualized figure: that belongs in the binding agreement, not a marketing page.
  assert(!/\bAPR\b/i.test(body), "no APR anywhere on the page");
  assert(!/annualized/i.test(body), "no annualized figure anywhere on the page");

  /**
   * WHO BEARS THE EARLY PAY FEE. The most misreadable claim on the page, and the one with the
   * most riding on it: the engine nets the fee out of the supplier's early payment
   * (`principal = invoice - fee`) and the buyer repays `total = invoice`. A card of percentages
   * on a buyer-facing page reads as the buyer's cost unless the page says otherwise, so the
   * attribution is asserted as content, not left to survive the next copy edit.
   */
  const whoPays = await page.locator("[data-product='early-pay'] [data-who-pays]").count();
  assert(whoPays === 1, "Early Pay carries the who-pays panel", String(whoPays));
  const whoPaysText = await page
    .locator("[data-product='early-pay'] [data-who-pays]")
    .innerText();
  assert(
    /pays this rate, not you/i.test(whoPaysText),
    "the page says the supplier pays the rate, not the buyer",
  );
  assert(
    /invoice face/i.test(whoPaysText),
    "the page says the buyer repays only the invoice face",
  );
  // The buyer reward is real (a slice of Payve's share, rebated on timely repayment) but it is
  // CONDITIONAL. A bare "you earn" without the condition would be the misleading form.
  assert(/earn income/i.test(whoPaysText), "the page states the buyer earns on Early Pay");
  assert(
    /on time/i.test(whoPaysText),
    "the buyer reward is stated as conditional on paying on time",
  );

  console.log("\nThe rate ladder shows the linearity");
  const tiers = await page.locator("[data-tier]").count();
  assert(tiers === 3, "all three tiers render", String(tiers));
  const at30 = await page.locator("[data-tier-cost]").first().innerText();
  assert(/1\.85%/.test(at30), "tier 1 reads 1.85% at the default 30 days", at30.trim());
  // Drag to 15 days: half the days must cost half as much, which is the claim being made.
  await page.locator("[data-days-input]").fill("15");
  await page.waitForTimeout(200);
  const at15 = await page.locator("[data-tier-cost]").first().innerText();
  assert(/0\.93%/.test(at15), "halving the days halves the cost", at15.trim());

  console.log("\nComparison and copy");
  assert((await page.locator("[data-comparison]").count()) === 1, "the comparison renders");
  assert((await page.locator("[data-compare]").count()) === 2, "both products are compared");
  // The vocabulary rules are enforced by verify-rebrand's grep over source, but the rendered
  // page is where a customer meets them.
  for (const banned of ["lend", "loan", "factoring", "borrow", "seamless", "ecosystem"]) {
    assert(!new RegExp(`\\b${banned}`, "i").test(body), `copy avoids "${banned}"`);
  }

  console.log("\nResponsive and console");
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(250);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    assert(overflow <= 1, `no horizontal overflow at ${width}px`, `overflow ${overflow}px`);
  }
  assert(consoleErrors.length === 0, "no console errors", consoleErrors.slice(0, 3).join(" | "));
} catch (err) {
  console.error(`\n[verify-working-capital] threw: ${err && err.message}`);
  failures.push(`exception: ${err && err.message}`);
} finally {
  if (browser) await browser.close().catch(() => {});
  await shutdown();
}

console.log(`\n[verify-working-capital] ${passed}/${passed + failures.length} checks passed`);
if (failures.length) {
  console.error("[verify-working-capital] FAILED:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("[verify-working-capital] PASS");
