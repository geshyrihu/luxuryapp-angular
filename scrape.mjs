
import { chromium } from "playwright";
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  console.log("Navigating to login...");
  await page.goto("http://localhost:4200/auth/login");
  await page.waitForLoadState("networkidle");
  
  console.log("Filling credentials...");
  await page.fill("input#username-global", "");
  await page.type("input#username-global", "admin", { delay: 50 });
  await page.fill("input#password-global", "");
  await page.type("input#password-global", "Hwtc00--", { delay: 50 });
  
  console.log("Clicking login...");
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle" }),
    page.click("button[type=\"submit\"]")
  ]).catch(e => console.log("Navigation timeout or error", e));
  
  await page.waitForTimeout(2000);
  
  console.log("Navigating to module...");
  await page.goto("http://localhost:4200/contabilidad/aspel-cobranza");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(5000);
  
  console.log("Taking screenshot...");
  await page.screenshot({ path: "C:/Users/geshyrihu/.gemini/antigravity/brain/1c135640-43c1-41d8-84bc-c53987b3b1e8/scratch/module.png" });
  
  const content = await page.evaluate(() => document.body.innerText);
  const fs = await import("fs");
  fs.writeFileSync("C:/Users/geshyrihu/.gemini/antigravity/brain/1c135640-43c1-41d8-84bc-c53987b3b1e8/scratch/content.txt", content);
  console.log("Done");
  await browser.close();
})();

