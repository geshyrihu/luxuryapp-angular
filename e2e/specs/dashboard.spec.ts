import { test, expect } from '../fixtures/test-fixtures';

test.describe('Dashboard', () => {
  test.describe.configure({ retries: 1 });

  test('debería cargar el dashboard tras login exitoso', async ({ authenticatedPage, dashboardPage }) => {
    await dashboardPage.expectLoaded();
    await dashboardPage.expectWelcomeMessage();
  });

  test('debería mostrar tarjetas de estadísticas', async ({ authenticatedPage, dashboardPage }) => {
    await dashboardPage.expectLoaded();
    await dashboardPage.expectStatsVisible();
  });

  test('debería permitir cerrar sesión', async ({ authenticatedPage, dashboardPage, loginPage }) => {
    await dashboardPage.expectLoaded();
    await dashboardPage.logout();
    await expect(loginPage.page).toHaveURL(/\/login/);
  });

  test('debería navegar a secciones del sidebar', async ({ authenticatedPage, dashboardPage }) => {
    await dashboardPage.expectLoaded();
    const sections = ['Clientes', 'Productos', 'Pedidos', 'Reportes'];
    
    for (const section of sections) {
      await test.step(`Navegar a ${section}`, async () => {
        await dashboardPage.navigateTo(section);
        await expect(dashboardPage.mainContent).toBeVisible();
      });
    }
  });
});