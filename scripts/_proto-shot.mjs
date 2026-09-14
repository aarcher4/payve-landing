import { chromium } from "playwright";
const browser = await chromium.launch();
for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 700 }]) {
  const page = await browser.newPage({ viewport: vp });
  page.on("pageerror", (e) => console.log("PAGEERROR:", String(e).slice(0, 200)));
  await page.goto("file:///C:/Users/Alex%20Archer/Desktop/payve-landing/design-context/network-canvas-proto.html");
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `.goal-loop/screens/proto2-${vp.width}.png` });
  await page.close();
}
await browser.close();
console.log("proto2 shots done");
