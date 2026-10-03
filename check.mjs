
import { chromium } from "playwright";
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("http://localhost:4200/auth/login");
  await page.waitForTimeout(2000);
  const content = await page.evaluate(() => document.body.innerHTML);
  console.log(content.substring(0, 5000));
  await browser.close();
})();

