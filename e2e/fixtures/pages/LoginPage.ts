import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly forgotPasswordLink: Locator;
  readonly errorMessage: Locator;
  readonly loadingSpinner: Locator;

  constructor(private page: Page) {
    // Web version selectors (PrimeNG custom-input-text-signal)
    this.usernameInput = page.locator('custom-input-text-signal[id="username-global"] input').first();
    this.passwordInput = page.locator('custom-input-password-signal[id="password-global"] input').first();
    this.submitButton = page.getByRole('button', { name: /iniciar sesión/i });
    this.rememberMeCheckbox = page.locator('custom-input-check-signal[id="checkbox-remember-global"] input').first();
    this.forgotPasswordLink = page.getByRole('link', { name: /olvidaste tu contraseña/i });
    this.errorMessage = page.locator('.border-red-300, .alert-danger, .error-message, [data-testid="login-error"]');
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"], .spinner, .pi-spin');
  }

  async goto() {
    await this.page.goto('/login');
    // Wait for login form to be visible (not the initial loading spinner)
    await this.page.waitForSelector('custom-input-text-signal[id="username-global"]', { 
      state: 'visible', 
      timeout: 30000 
    });
    await this.page.waitForLoadState('networkidle');
  }

  async login(username: string, password: string, rememberMe = false) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    if (rememberMe) {
      await this.rememberMeCheckbox.check();
    }
    await this.submitButton.click({ force: true });
    await this.page.waitForLoadState('networkidle');
  }

  async expectLoginSuccess(expectedUrl = '/dashboard') {
    await expect(this.page).toHaveURL(new RegExp(expectedUrl));
  }

  async expectLoginError(message?: string) {
    await expect(this.errorMessage).toBeVisible();
    if (message) {
      await expect(this.errorMessage).toContainText(message);
    }
  }

  async expectFieldErrors() {
    // PrimeNG usa clases para validación: p-invalid, ng-invalid
    await expect(this.usernameInput).toHaveClass(/p-invalid|ng-invalid/);
    await expect(this.passwordInput).toHaveClass(/p-invalid|ng-invalid/);
  }

  async fillUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  async isSubmitEnabled() {
    return await this.submitButton.isEnabled();
  }
}