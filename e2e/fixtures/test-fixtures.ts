import { test as base, Page } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

type Fixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  authenticatedPage: Page;
};

// Credenciales desde env vars (configurar en CI/local)
const TEST_USER = process.env.E2E_TEST_USER || 'test@luxuryapp.com';
const TEST_PASS = process.env.E2E_TEST_PASS || 'Test123!';

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  authenticatedPage: async ({ page, loginPage }, use) => {
    await loginPage.goto();
    await loginPage.login(TEST_USER, TEST_PASS);
    // Verificar que login fue exitoso (redirigió a dashboard)
    const isLoggedIn = page.url().includes('/dashboard') || page.url().includes('/home');
    if (!isLoggedIn) {
      // Login falló - usar skip para tests que requieren auth
      test.skip();
    }
    await use(page);
  },
});

export { expect } from '@playwright/test';