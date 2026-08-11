import { chromium } from "playwright";

const url =
  "http://localhost:6010/iframe.html?id=design-system-charts-chartwrapper--con-options&viewMode=story";

const browser = await chromium.launch();
const page = await browser.newPage();
page.on("pageerror", (e) => console.log("PAGEERROR:", e.message));
await page.goto(url, { waitUntil: "load" });
await page.waitForSelector("app-chart-wrapper canvas", { timeout: 30000 });
await page.waitForTimeout(700);

const probe = () =>
  page.evaluate(async () => {
    const ec = await import("echarts");
    const c = document.querySelector("app-chart-wrapper canvas");
    const inst = ec.getInstanceByDom(c.parentElement);
    const opt = inst ? inst.getOption() : null;
    const s = opt?.series?.[0];
    const x = opt?.xAxis?.[0];
    return {
      seriesColor: s?.itemStyle?.color,
      axisColor: x?.axisLabel?.color,
      legendColor: opt?.legend?.[0]?.textStyle?.color,
      htmlTheme: document.documentElement.getAttribute("data-theme"),
    };
  });

console.log("BEFORE:", JSON.stringify(await probe()));
await page.getByText("Alternar tema").click();
await page.waitForTimeout(900);
console.log("AFTER :", JSON.stringify(await probe()));
await browser.close();
