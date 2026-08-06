# Playwright E2E Tests

## Estructura

```
e2e/
├── fixtures/
│   ├── pages/
│   │   ├── LoginPage.ts
│   │   ├── DashboardPage.ts
│   │   └── index.ts
│   └── test-fixtures.ts
├── specs/
│   ├── auth.spec.ts
│   └── dashboard.spec.ts
├── playwright.config.ts
└── README.md
```

## Comandos

```bash
# Ejecutar todos los tests
npm run test:e2e

# Modo UI interactivo (recomendado)
npm run test:e2e:ui

# Con navegador visible
npm run test:e2e:headed

# Debug paso a paso
npm run test:e2e:debug

# Solo un archivo
npx playwright test e2e/specs/auth.spec.ts

# Solo tests que coincidan con patrón
npx playwright test -g "login"

# Generar código grabando acciones
npx playwright codegen http://localhost:4200

# Ver reporte HTML
npx playwright show-report

# Ejecutar en CI (headless, con retries)
npm run test:e2e:ci
```

## Page Objects

Usar el patrón Page Object para mantener tests limpios:

```typescript
// e2e/fixtures/pages/LoginPage.ts
export class LoginPage {
  readonly emailInput = page.getByLabel('Email');
  // ...
  
  async login(email: string, password: string) { ... }
}
```

## Fixtures

Extender `test` con fixtures personalizados en `test-fixtures.ts`:

```typescript
export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  authenticatedPage: async ({ page, loginPage }, use) => {
    await loginPage.login('user@test.com', 'password');
    await use(page);
  },
});
```

## Selectores recomendados

| Prioridad | Selector | Ejemplo |
|-----------|----------|---------|
| 1 | `getByRole` | `page.getByRole('button', { name: 'Enviar' })` |
| 2 | `getByLabel` | `page.getByLabel('Email')` |
| 3 | `getByPlaceholder` | `page.getByPlaceholder('Buscar...')` |
| 4 | `getByText` | `page.getByText('Bienvenido')` |
| 5 | `getByTestId` | `page.getByTestId('submit-btn')` |
| 6 | CSS/XPath | Solo si no hay alternativa |

## Debugging

- `trace: 'on-first-retry'` en config → ver traces en `test-results/`
- `screenshot: 'only-on-failure'` → capturas en fallos
- `video: 'retain-on-failure'` → videos en fallos
- `--debug` → abre inspector de Playwright
- `--ui` → interfaz visual completa

## CI/CD

El config detecta `CI=true` y:
- Ejecuta en serie (`workers: 1`)
- Reintenta 2 veces fallos
- No reutiliza servidor web
- Genera reporte HTML