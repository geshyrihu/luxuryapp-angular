import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly pageTitle: Locator;
  readonly userMenu: Locator;
  readonly logoutButton: Locator;
  readonly sidebar: Locator;
  readonly mainContent: Locator;
  readonly statsCards: Locator;
  readonly welcomeMessage: Locator;

  constructor(private page: Page) {
    this.pageTitle = page.getByRole('heading', { level: 1 });
    this.userMenu = page.getByRole('button', { name: /usuario|perfil|cuenta/i });
    this.logoutButton = page.getByRole('menuitem', { name: /cerrar sesión|logout/i });
    this.sidebar = page.locator('aside, [data-testid="sidebar"], .sidebar');
    this.mainContent = page.locator('main, [data-testid="main-content"], .main-content');
    this.statsCards = page.locator('[data-testid="stat-card"], .stat-card, .dashboard-stats');
    this.welcomeMessage = page.locator('[data-testid="welcome"], .welcome-message');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/dashboard/);
    await expect(this.mainContent).toBeVisible();
    await this.page.waitForLoadState('networkidle');
  }

  async expectWelcomeMessage(userName?: string) {
    await expect(this.welcomeMessage).toBeVisible();
    if (userName) {
      await expect(this.welcomeMessage).toContainText(userName);
    }
  }

  async logout() {
    await this.userMenu.click();
    await this.logoutButton.click();
    await this.page.waitForURL(/\/login/);
  }

  async navigateTo(menuItem: string) {
    const link = this.sidebar.getByRole('link', { name: new RegExp(menuItem, 'i') });
    await link.click();
    await this.page.waitForLoadState('networkidle');
  }

  async expectStatsVisible(count = 4) {
    await expect(this.statsCards).toHaveCount(count);
  }
}