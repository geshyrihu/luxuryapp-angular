import { chromium } from "playwright";

const url =
  "http://localhost:6010/iframe.html?id=design-system-charts-chartwrapper--con-datos&viewMode=story";

const browser = await chromium.launch();
const page = await browser.newPage();
page.on("console", (m) => console.log("CONSOLE:", m.type(), m.text()));
page.on("pageerror", (e) => console.log("PAGEERROR:", e.message));

await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(4000);
const info = await page.evaluate(() => {
  const root = document.querySelector("app-chart-wrapper");
  const host = document.querySelector("sb-chart-host");
  return {
    hasWrapper: !!root,
    hasCanvas: !!document.querySelector("app-chart-wrapper canvas"),
    hostText: host ? host.innerText : null,
    buttons: [...document.querySelectorAll("button")].map((x) => x.innerText),
  };
});
console.log("INFO:", JSON.stringify(info, null, 2));
await browser.close();
