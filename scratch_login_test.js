const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  try {
    await page.goto('http://localhost:4200/login', { waitUntil: 'networkidle' });
    const usernameInput = page.locator('custom-input-text-signal[id="username-global"] input').first();
    await usernameInput.fill('admin'); // Trying generic admin
    const passwordInput = page.locator('custom-input-password-signal[id="password-global"] input').first();
    await passwordInput.fill('admin');
    const submitBtn = page.getByRole('button', { name: /iniciar sesión/i });
    await submitBtn.click({ force: true });
    
    await page.waitForURL('**/dashboard', { timeout: 5000 });
    console.log("LOGIN SUCCESS WITH admin/admin");
  } catch (e) {
    console.log("Login failed");
  }
  await browser.close();
})();
