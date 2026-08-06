# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Autenticación >> debería mostrar la página de login
- Location: e2e\specs\auth.spec.ts:6:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForSelector: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('custom-input-text-signal[id="username-global"]') to be visible
    33 × locator resolved to hidden <custom-input-text-signal label="Usuario" id="username-global" placeholder="Ej: jperez" customclass="h-3rem text-lg">…</custom-input-text-signal>

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Saltar al contenido principal" [ref=e2]:
    - /url: "#app-root-outlet"
  - generic "Aplicación LuxuryApp" [ref=e3]:
    - generic:
      - alertdialog
    - main [ref=e4]:
      - main [ref=e9]:
        - generic [ref=e15]:
          - img "Logo Luxury Building Group" [ref=e17]
          - generic [ref=e18]:
            - heading "Bienvenido" [level=2] [ref=e19]
            - paragraph [ref=e20]: Ingresa a tu cuenta
            - generic [ref=e21]:
              - generic [ref=e25]:
                - generic [ref=e26]: Usuario
                - generic: Usuario
                - textbox "Usuario" [ref=e29]:
                  - /placeholder: "Ej: jperez"
              - generic [ref=e33]:
                - generic [ref=e34]: Contraseña
                - generic: Contraseña
                - generic [ref=e36]:
                  - textbox "Contraseña" [ref=e37]:
                    - /placeholder: ••••••••
                  - button "Toggle password visibility" [ref=e39] [cursor=pointer]
              - generic [ref=e42]:
                - generic:
                  - button "INICIAR SESIÓN" [disabled]
              - generic [ref=e43]: ¿Olvidaste tu contraseña?
```

# Test source

```ts
  1  | import { Page, Locator, expect } from '@playwright/test';
  2  | 
  3  | export class LoginPage {
  4  |   readonly usernameInput: Locator;
  5  |   readonly passwordInput: Locator;
  6  |   readonly submitButton: Locator;
  7  |   readonly rememberMeCheckbox: Locator;
  8  |   readonly forgotPasswordLink: Locator;
  9  |   readonly errorMessage: Locator;
  10 |   readonly loadingSpinner: Locator;
  11 | 
  12 |   constructor(private page: Page) {
  13 |     // Web version selectors (PrimeNG custom-input-text-signal)
  14 |     this.usernameInput = page.locator('custom-input-text-signal[id="username-global"] input').first();
  15 |     this.passwordInput = page.locator('custom-input-password-signal[id="password-global"] input').first();
  16 |     this.submitButton = page.getByRole('button', { name: /iniciar sesión/i });
  17 |     this.rememberMeCheckbox = page.locator('custom-input-check-signal[id="checkbox-remember-global"] input').first();
  18 |     this.forgotPasswordLink = page.getByRole('link', { name: /olvidaste tu contraseña/i });
  19 |     this.errorMessage = page.locator('.border-red-300, .alert-danger, .error-message, [data-testid="login-error"]');
  20 |     this.loadingSpinner = page.locator('[data-testid="loading-spinner"], .spinner, .pi-spin');
  21 |   }
  22 | 
  23 |   async goto() {
  24 |     await this.page.goto('/login');
  25 |     // Wait for login form to be visible (not the initial loading spinner)
> 26 |     await this.page.waitForSelector('custom-input-text-signal[id="username-global"]', { 
     |                     ^ Error: page.waitForSelector: Test timeout of 30000ms exceeded.
  27 |       state: 'visible', 
  28 |       timeout: 30000 
  29 |     });
  30 |     await this.page.waitForLoadState('networkidle');
  31 |   }
  32 | 
  33 |   async login(username: string, password: string, rememberMe = false) {
  34 |     await this.usernameInput.fill(username);
  35 |     await this.passwordInput.fill(password);
  36 |     if (rememberMe) {
  37 |       await this.rememberMeCheckbox.check();
  38 |     }
  39 |     await this.submitButton.click({ force: true });
  40 |     await this.page.waitForLoadState('networkidle');
  41 |   }
  42 | 
  43 |   async expectLoginSuccess(expectedUrl = '/dashboard') {
  44 |     await expect(this.page).toHaveURL(new RegExp(expectedUrl));
  45 |   }
  46 | 
  47 |   async expectLoginError(message?: string) {
  48 |     await expect(this.errorMessage).toBeVisible();
  49 |     if (message) {
  50 |       await expect(this.errorMessage).toContainText(message);
  51 |     }
  52 |   }
  53 | 
  54 |   async expectFieldErrors() {
  55 |     // PrimeNG usa clases para validación: p-invalid, ng-invalid
  56 |     await expect(this.usernameInput).toHaveClass(/p-invalid|ng-invalid/);
  57 |     await expect(this.passwordInput).toHaveClass(/p-invalid|ng-invalid/);
  58 |   }
  59 | 
  60 |   async fillUsername(username: string) {
  61 |     await this.usernameInput.fill(username);
  62 |   }
  63 | 
  64 |   async fillPassword(password: string) {
  65 |     await this.passwordInput.fill(password);
  66 |   }
  67 | 
  68 |   async clickForgotPassword() {
  69 |     await this.forgotPasswordLink.click();
  70 |   }
  71 | 
  72 |   async isSubmitEnabled() {
  73 |     return await this.submitButton.isEnabled();
  74 |   }
  75 | }
```