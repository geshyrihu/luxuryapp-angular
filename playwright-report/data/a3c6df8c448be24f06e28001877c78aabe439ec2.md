# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Autenticación >> debería fallar con usuario inválido
- Location: e2e\specs\auth.spec.ts:22:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /iniciar sesión/i })
    - locator resolved to <button disabled type="submit" class="btn btn-fluid btn-warning">…</button>
  - attempting click action
    - scrolling into view if needed
    - done scrolling
    - forcing action
    - performing click action

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - link "Saltar al contenido principal" [ref=e2]:
    - /url: "#app-root-outlet"
  - generic "Aplicación LuxuryApp" [ref=e3]:
    - generic:
      - alertdialog
    - main [ref=e4]:
      - generic [ref=e8]:
        - img "Slider Background" [ref=e10]
        - generic [ref=e12]:
          - generic [ref=e13]:
            - generic [ref=e15]:
              - generic [ref=e16]:
                - img "Logo Luxury Building Group" [ref=e17]
                - heading "Bienvenido de nuevo" [level=2] [ref=e18]
                - paragraph [ref=e19]: Inicia sesión
              - generic [ref=e20]:
                - generic [ref=e25]:
                  - generic [ref=e26]: Usuario *
                  - 'textbox "Ej: jperez" [active] [ref=e28]'
                - generic [ref=e33]:
                  - generic [ref=e34]: Contraseña *
                  - textbox "••••••••" [ref=e37]
                - generic [ref=e40]:
                  - generic [ref=e47]:
                    - checkbox [checked] [ref=e49] [cursor=pointer]
                    - generic [ref=e54] [cursor=pointer]: Recordarme
                  - link "¿Olvidaste tu contraseña?" [ref=e55]:
                    - /url: /auth/recovery-password
                - generic [ref=e57]:
                  - button "INICIAR SESIÓN" [disabled]
            - generic [ref=e58]: © 2026 Luxury Building Group. Todos los derechos reservados.
          - generic [ref=e60]:
            - heading "Excelencia Inmobiliaria" [level=1] [ref=e66]
            - paragraph [ref=e67]: Gestiona recursos, proyectos y operaciones.
```

# Test source

```ts
  1  | import { test, expect } from '../fixtures/test-fixtures';
  2  | 
  3  | test.describe('Autenticación', () => {
  4  |   test.describe.configure({ retries: 1 });
  5  | 
  6  |   test('debería mostrar la página de login', async ({ loginPage }) => {
  7  |     await loginPage.goto();
  8  |     await expect(loginPage.usernameInput).toBeVisible();
  9  |     await expect(loginPage.passwordInput).toBeVisible();
  10 |     await expect(loginPage.submitButton).toBeVisible();
  11 |   });
  12 | 
  13 |   test('debería fallar con credenciales inválidas', async ({ loginPage }) => {
  14 |     await loginPage.goto();
  15 |     await loginPage.login('invaliduser', 'wrongpassword');
  16 |     // Verificar que sigue en login (no redirigió a dashboard) o hay error visible
  17 |     await expect(loginPage.page).toHaveURL(/\/login/);
  18 |     // Opcional: verificar error si el backend responde
  19 |     // await loginPage.expectLoginError();
  20 |   });
  21 | 
  22 |   test('debería fallar con usuario inválido', async ({ loginPage }) => {
  23 |     await loginPage.goto();
  24 |     await loginPage.fillUsername('');  // Vacío para activar required
  25 |     await loginPage.fillPassword('password123');
> 26 |     await loginPage.submitButton.click({ force: true });
     |                                  ^ Error: locator.click: Test timeout of 30000ms exceeded.
  27 |     // Solo username debería marcarse inválido
  28 |     await expect(loginPage.usernameInput).toHaveClass(/p-invalid|ng-invalid/);
  29 |   });
  30 | 
  31 |   test('debería fallar con campos vacíos', async ({ loginPage }) => {
  32 |     await loginPage.goto();
  33 |     // Botón está deshabilitado con form vacío - verificar que está disabled
  34 |     await expect(loginPage.submitButton).toBeDisabled();
  35 |   });
  36 | 
  37 |   test('debería navegar a recuperación de contraseña', async ({ loginPage }) => {
  38 |     await loginPage.goto();
  39 |     await loginPage.clickForgotPassword();
  40 |     await expect(loginPage.page).toHaveURL(/\/recovery-password/);
  41 |   });
  42 | });
```