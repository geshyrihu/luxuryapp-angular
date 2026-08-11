import { chromium } from "playwright";

const url =
  "http://localhost:6010/iframe.html?id=design-system-charts-chartwrapper--con-datos&viewMode=story";

function fullHash(data) {
  let h = 0;
  for (let i = 0; i < data.length; i += 4) {
    h = (h * 31 + data[i] + data[i + 1] * 3 + data[i + 2] * 7) >>> 0;
  }
  return h;
}

const browser = await chromium.launch();
const page = await browser.newPage();
page.on("pageerror", (e) => console.log("PAGEERROR:", e.message));
page.on("console", (m) => {
  if (m.text().includes("THEMEDOPTIONS") || m.text().includes("CSSVAR"))
    console.log("CONSOLE:", m.text());
});
await page.goto(url, { waitUntil: "load" });
await page.waitForSelector("app-chart-wrapper canvas", { timeout: 30000 });
await page.waitForTimeout(700);

const snap = () =>
  page.evaluate(() => {
    const c = document.querySelector("app-chart-wrapper canvas");
    const ctx = c.getContext("2d");
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    let h = 0;
    for (let i = 0; i < d.length; i += 4)
      h = (h * 31 + d[i] + d[i + 1] * 3 + d[i + 2] * 7) >>> 0;
    const html = document.documentElement;
    return {
      hash: h,
      className: html.className,
      dataTheme: html.getAttribute("data-theme"),
    };
  });

const before = await snap();
console.log("BEFORE:", JSON.stringify(before));
await page.getByText("Alternar tema").click();
await page.waitForTimeout(900);
const after = await snap();
console.log("AFTER :", JSON.stringify(after));
console.log("CHANGED:", before.hash !== after.hash);
await browser.close();
