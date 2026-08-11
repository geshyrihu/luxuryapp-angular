import { chromium } from "playwright";

const BASE = "http://localhost:6010";
const stories = [
  {
    name: "ConDatos",
    url: `${BASE}/iframe.html?id=design-system-charts-chartwrapper--con-datos&viewMode=story`,
  },
  {
    name: "ConOptions",
    url: `${BASE}/iframe.html?id=design-system-charts-chartwrapper--con-options&viewMode=story`,
  },
];

async function canvasHash(page) {
  return await page.evaluate(() => {
    const c = document.querySelector("app-chart-wrapper canvas");
    if (!c) return null;
    const ctx = c.getContext("2d");
    if (!ctx) return null;
    const { data } = ctx.getImageData(0, 0, c.width, c.height);
    let hash = 0;
    for (let i = 0; i < data.length; i += 257) {
      hash = (hash * 31 + data[i]) >>> 0;
    }
    return hash;
  });
}

const browser = await chromium.launch();
const results = {};

for (const s of stories) {
  const page = await browser.newPage();
  await page.goto(s.url, { waitUntil: "load" });
  await page.waitForSelector("app-chart-wrapper canvas", { timeout: 30000 });
  await page.waitForTimeout(600);
  const before = await canvasHash(page);
  const btn = page.getByText("Alternar tema");
  await btn.click();
  await page.waitForTimeout(900);
  const after = await canvasHash(page);
  const changed = before !== null && after !== null && before !== after;
  results[s.name] = { before, after, changed };
  console.log(`${s.name}: before=${before} after=${after} changed=${changed}`);
  await page.close();
}

await browser.close();

const allOk = Object.values(results).every((r) => r.changed);
console.log(allOk ? "VERIFICATION PASS" : "VERIFICATION FAIL");
process.exit(allOk ? 0 : 1);
