import { test, expect } from '../fixtures/test-fixtures';

test.describe('Autenticación', () => {
  test.describe.configure({ retries: 1 });

  test('debería mostrar la página de login', async ({ loginPage }) => {
    await loginPage.goto();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('debería fallar con credenciales inválidas', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('invaliduser', 'wrongpassword');
    // Verificar que sigue en login (no redirigió a dashboard) o hay error visible
    await expect(loginPage.page).toHaveURL(/\/login/);
    // Opcional: verificar error si el backend responde
    // await loginPage.expectLoginError();
  });

  test('debería fallar con usuario inválido', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.fillUsername('');  // Vacío para activar required
    await loginPage.fillPassword('password123');
    await loginPage.submitButton.click({ force: true });
    // Solo username debería marcarse inválido
    await expect(loginPage.usernameInput).toHaveClass(/p-invalid|ng-invalid/);
  });

  test('debería fallar con campos vacíos', async ({ loginPage }) => {
    await loginPage.goto();
    // Botón está deshabilitado con form vacío - verificar que está disabled
    await expect(loginPage.submitButton).toBeDisabled();
  });

  test('debería navegar a recuperación de contraseña', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.clickForgotPassword();
    await expect(loginPage.page).toHaveURL(/\/recovery-password/);
  });
});