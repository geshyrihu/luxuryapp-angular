const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  console.log("Navigating to http://localhost:4200/login...");
  try {
    await page.goto('http://localhost:4200/login', { waitUntil: 'networkidle' });
  } catch (e) {
    console.error("Failed to load page", e);
  }

  console.log("Logging in...");
  try {
    const usernameInput = page.locator('custom-input-text-signal[id="username-global"] input').first();
    await usernameInput.waitFor({ state: 'visible', timeout: 5000 });
    await usernameInput.fill('test@luxuryapp.com');
    
    const passwordInput = page.locator('custom-input-password-signal[id="password-global"] input').first();
    await passwordInput.fill('Test123!');
    
    const submitBtn = page.getByRole('button', { name: /iniciar sesión/i });
    await submitBtn.click({ force: true });
    
    console.log("Waiting for dashboard redirect...");
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
  } catch (e) {
    console.log("Login failed or no redirect. URL is:", page.url());
    console.log(e);
  }

  console.log("Waiting for trigger element...");
  try {
    await page.waitForSelector('.app-popover-trigger, [appPopoverTrigger]', { timeout: 10000 });
  } catch (e) {
    console.log("Trigger element not found on dashboard. URL is:", page.url());
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log("Body text:", bodyText.substring(0, 200));
    await browser.close();
    return;
  }

  console.log("Element found, executing script...");
  const result = await page.evaluate(() => {
    const logs = [];
    const clientWidth = document.documentElement.clientWidth;
    let el = document.querySelector('.app-popover-trigger') || document.querySelector('[appPopoverTrigger]');
    
    logs.push(`clientWidth real: ${clientWidth} innerWidth: ${window.innerWidth}`);
    
    while (el) {
      const r = el.getBoundingClientRect();
      const cs = window.getComputedStyle(el);
      logs.push(`${el.tagName} ${el.className} | right: ${r.right.toFixed(1)} | width css: ${cs.width} | min-width: ${cs.minWidth} | position: ${cs.position}`);
      el = el.parentElement;
    }
    return logs;
  });

  console.log("=== SCRIPT OUTPUT ===");
  result.forEach(line => console.log(line));
  console.log("=====================");

  await browser.close();
})();
