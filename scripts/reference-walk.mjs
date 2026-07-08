#!/usr/bin/env node
/**
 * r3 reference research harness: scroll-walks marketing pages (whose sections
 * reveal on IntersectionObserver) capturing a viewport frame per step, plus a
 * structured facts dump (headings, CTA strings, icon census) per page.
 *
 * Run: node scripts/reference-walk.mjs
 * Output: design-context/reference-r3/<name>-NN.jpg + <name>.facts.json
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const OUT = "design-context/reference-r3";
mkdirSync(OUT, { recursive: true });

const PAGES = [
  { name: "mercury-home", url: "https://mercury.com/" },
  { name: "mercury-banking", url: "https://mercury.com/banking" },
  { name: "mercury-treasury", url: "https://mercury.com/treasury" },
  { name: "ramp-home", url: "https://ramp.com/" },
  { name: "ramp-ap", url: "https://ramp.com/accounts-payable" },
  { name: "ramp-expense", url: "https://ramp.com/expense-management" },
  { name: "ramp-customers", url: "https://ramp.com/customers" },
  { name: "ramp-story-hingham", url: "https://ramp.com/customers/hingham" },
  { name: "happyrobot-home", url: "https://happyrobot.ai/" },
  { name: "happyrobot-customers", url: "https://happyrobot.ai/customers" },
  { name: "brex-home", url: "https://brex.com/" },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 960 },
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
});
const page = await ctx.newPage();

for (const p of PAGES) {
  try {
    await page.goto(p.url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(3500);

    const facts = await page.evaluate(() => {
      const txt = (e) => (e.textContent || "").trim().replace(/\s+/g, " ");
      const heads = [...document.querySelectorAll("h1,h2,h3")]
        .map((h) => h.tagName + ": " + txt(h).slice(0, 110))
        .filter((s) => s.length > 4)
        .slice(0, 60);
      const svgs = [...document.querySelectorAll("svg")];
      const smallIcons = svgs.filter((s) => {
        const r = s.getBoundingClientRect();
        return r.width > 0 && r.width <= 32 && r.height <= 32;
      }).length;
      const ctas = [
        ...new Set(
          [...document.querySelectorAll("a,button")]
            .map(txt)
            .filter((t) => t && t.length < 45 && /demo|account|start|talk|contact|sales|tour|watch|book|schedule|see |explore/i.test(t))
        ),
      ].slice(0, 20);
      const eyebrows = [
        ...new Set(
          [...document.querySelectorAll("*")]
            .filter((e) => e.children.length === 0)
            .map((e) => ({ e, s: getComputedStyle(e) }))
            .filter(({ e, s }) => {
              const t = txt(e);
              return t && t.length < 50 && (s.textTransform === "uppercase" || parseFloat(s.letterSpacing) > 0.5) && parseFloat(s.fontSize) < 15;
            })
            .map(({ e }) => txt(e))
        ),
      ].slice(0, 20);
      return { title: document.title, heads, svgTotal: svgs.length, smallIcons, ctas, eyebrows };
    });
    writeFileSync(`${OUT}/${p.name}.facts.json`, JSON.stringify(facts, null, 1));

    const total = await page.evaluate(() => document.body.scrollHeight);
    const step = Math.round(960 * 0.92);
    const shots = Math.min(Math.ceil(total / step), 12);
    for (let i = 0; i < shots; i++) {
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), i * step);
      await page.waitForTimeout(900);
      await page.screenshot({
        path: `${OUT}/${p.name}-${String(i).padStart(2, "0")}.jpg`,
        type: "jpeg",
        quality: 65,
      });
    }
    console.log(`ok   ${p.name}: ${shots} frames, ${facts.svgTotal} svg (${facts.smallIcons} icon-sized), h=${total}`);
  } catch (e) {
    console.log(`FAIL ${p.name}: ${String(e).slice(0, 140)}`);
  }
}

await browser.close();
console.log("WALK DONE");
