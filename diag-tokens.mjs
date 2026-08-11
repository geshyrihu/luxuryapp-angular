import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(
  "http://localhost:6010/iframe.html?id=design-system-charts-chartwrapper--con-datos&viewMode=story",
  { waitUntil: "load" },
);
await page.waitForTimeout(3000);
const r = await page.evaluate(() => {
  const v = getComputedStyle(document.documentElement).getPropertyValue("--ds-cat-1");
  let found = false;
  for (const s of document.styleSheets) {
    try {
      for (const rule of s.cssRules) {
        if (rule.cssText && rule.cssText.includes("--ds-cat-1")) found = true;
      }
    } catch (e) {}
  }
  return { value: v, foundInSheets: found, htmlClass: document.documentElement.className };
});
console.log(JSON.stringify(r));
await browser.close();
