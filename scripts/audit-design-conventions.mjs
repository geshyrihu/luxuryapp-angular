#!/usr/bin/env node

/**
 * Audit Design System Conventions
 *
 * Verifica que todos los 20 componentes core cumplan con las reglas
 * definidas en DESIGN_CONVENTIONS.md.
 *
 * Uso: npm run audit:design-conventions
 *
 * Exit code 0 = todos los checks pasan
 * Exit code 1 = algún check falla
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..', '..');

// Colores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function exec(cmd, silent = true) {
  try {
    const result = execSync(cmd, {
      cwd: rootDir,
      encoding: 'utf-8',
      stdio: silent ? 'pipe' : 'inherit',
    });
    return result.trim();
  } catch (error) {
    return silent ? '' : null;
  }
}

function countMatches(pattern, dir = 'client/angular/src') {
  try {
    const result = exec(
      `grep -r "${pattern}" ${dir} 2>/dev/null | wc -l`,
      true
    );
    return parseInt(result) || 0;
  } catch {
    return 0;
  }
}

// Matriz de auditoría
const auditMatrix = [
  {
    id: 'CORE-01',
    name: 'Data View',
    selector: 'lx-data-view',
    checks: [
      {
        name: 'Selector lx-data-view en uso',
        test: () => countMatches('<lx-data-view', 'client/angular/src/app/apps') >= 1,
        weight: 10,
      },
      {
        name: 'Sin <p-table> en mobile',
        test: () => {
          const result = exec(
            `grep -r "<lx-data-view" client/angular/src/app/shared/ui/mobile -A20 2>/dev/null | grep -c "<p-table" || echo 0`,
            true
          );
          return parseInt(result) === 0;
        },
        weight: 10,
      },
      {
        name: 'Botones con prefijo correcto (web)',
        test: () => countMatches('<il-button-\\|<iw-button-', 'client/angular/src/app/shared/ui/web/data-view') >= 1,
        weight: 10,
      },
      {
        name: 'ARIA role="table" presente',
        test: () => countMatches('role="table"', 'client/angular/src/app/shared/ui/web/data-view') >= 1,
        weight: 10,
      },
      {
        name: 'Paginación con PaginationStore',
        test: () => countMatches('PaginationStore', 'client/angular/src/app') >= 1,
        weight: 10,
      },
      {
        name: 'Sin HttpClient directo en componente',
        test: () => countMatches('private http: HttpClient', 'client/angular/src/app/shared/ui/adaptive/data-view') === 0,
        weight: 10,
      },
      {
        name: 'Tipado estricto (sin any)',
        test: () => countMatches(': any', 'client/angular/src/app/shared/ui/adaptive/data-view') === 0,
        weight: 10,
      },
      {
        name: 'ChangeDetectionStrategy presente',
        test: () => countMatches('ChangeDetectionStrategy', 'client/angular/src/app/shared/ui/adaptive/data-view') >= 1,
        weight: 10,
      },
    ],
  },

  {
    id: 'CORE-02',
    name: 'Accordion',
    selector: 'lx-accordion',
    checks: [
      {
        name: 'Selector lx-accordion en uso',
        test: () => countMatches('<lx-accordion', 'client/angular/src/app') >= 1,
        weight: 20,
      },
      {
        name: 'ng-content NO duplicado',
        test: () => {
          const result = exec(
            `grep -r "<lx-accordion" client/angular/src/app/shared/ui/adaptive/accordion -A20 2>/dev/null | grep -c "<ng-content" || echo 0`,
            true
          );
          return parseInt(result) <= 1;
        },
        weight: 20,
      },
      {
        name: 'ARIA aria-expanded presente',
        test: () => countMatches('aria-expanded', 'client/angular/src/app/shared/ui/adaptive/accordion') >= 1,
        weight: 20,
      },
      {
        name: 'Tipado estricto (sin any)',
        test: () => countMatches(': any', 'client/angular/src/app/shared/ui/adaptive/accordion') === 0,
        weight: 20,
      },
      {
        name: 'Imports de base + plataformas',
        test: () => countMatches('import.*Accordion\\|import.*MobileAccordion', 'client/angular/src/app/shared/ui/adaptive/accordion') >= 2,
        weight: 20,
      },
    ],
  },

  {
    id: 'CORE-03',
    name: 'Buttons',
    selector: 'il-button-*, iw-button-*, ili-button-*',
    checks: [
      {
        name: 'Selectores válidos en uso',
        test: () => countMatches('<il-button-\\|<iw-button-\\|<ili-button-', 'client/angular/src/app') >= 1,
        weight: 15,
      },
      {
        name: 'Sin <button> nativa en apps',
        test: () => countMatches('<button[^>]*>', 'client/angular/src/app/apps') === 0,
        weight: 15,
      },
      {
        name: 'aria-label en botones solo-icono (muestreo)',
        test: () => countMatches('aria-label', 'client/angular/src/app/shared/ui/buttons/web-icon') >= 1,
        weight: 15,
      },
      {
        name: 'Sin mezcla il-* + ili-* en mismo scope',
        test: () => {
          const result = exec(
            `grep -r "<il-button-" client/angular/src/app -A5 -B5 2>/dev/null | grep -c "<ili-button-" || echo 0`,
            true
          );
          return parseInt(result) === 0;
        },
        weight: 15,
      },
      {
        name: 'Selectores en archivos base',
        test: () => {
          const webLabel = exec(`ls -1 client/angular/src/app/shared/ui/buttons/web-label/*.ts 2>/dev/null | wc -l`, true);
          return parseInt(webLabel) >= 6;
        },
        weight: 20,
      },
      {
        name: 'Tipado estricto (sin any)',
        test: () => countMatches(': any', 'client/angular/src/app/shared/ui/buttons') <= 3,
        weight: 20,
      },
    ],
  },

  {
    id: 'CORE-04',
    name: 'Custom Input (27 variantes)',
    selector: 'custom-input-*-signal',
    checks: [
      {
        name: 'Selectores custom-input en uso',
        test: () => countMatches('<custom-input-', 'client/angular/src/app') >= 1,
        weight: 15,
      },
      {
        name: 'Sin p-inputText en apps',
        test: () => countMatches('<p-inputText', 'client/angular/src/app/apps') === 0,
        weight: 15,
      },
      {
        name: 'Sin ion-input directo',
        test: () => countMatches('<ion-input', 'client/angular/src/app/apps') === 0,
        weight: 15,
      },
      {
        name: 'Reactive Forms en uso',
        test: () => countMatches('formControlName\\|FormGroup', 'client/angular/src/app') >= 1,
        weight: 15,
      },
      {
        name: 'Labels asociados',
        test: () => countMatches('<label for=', 'client/angular/src/app/shared/ui/inputs') >= 1,
        weight: 20,
      },
      {
        name: 'Tipado estricto (sin any)',
        test: () => countMatches(': any', 'client/angular/src/app/shared/ui/inputs') <= 3,
        weight: 20,
      },
    ],
  },

  {
    id: 'CORE-05',
    name: 'Dialog/Modal',
    selector: 'lx-dialog (adaptive)',
    checks: [
      {
        name: 'DialogHandlerService en uso',
        test: () => countMatches('DialogHandlerService', 'client/angular/src/app') >= 1,
        weight: 20,
      },
      {
        name: 'Sin DialogService.open() directo',
        test: () => countMatches('DialogService.open', 'client/angular/src/app/apps') === 0,
        weight: 20,
      },
      {
        name: 'role="dialog" presente',
        test: () => countMatches('role="dialog"', 'client/angular/src/app/shared/ui/adaptive/confirm-dialog') >= 1,
        weight: 20,
      },
      {
        name: 'aria-modal presente',
        test: () => countMatches('aria-modal', 'client/angular/src/app/shared/ui/adaptive/confirm-dialog') >= 1,
        weight: 20,
      },
      {
        name: 'Tipado estricto (sin any)',
        test: () => countMatches(': any', 'client/angular/src/app/shared/ui/adaptive/confirm-dialog') <= 2,
        weight: 20,
      },
    ],
  },

  {
    id: 'CORE-06',
    name: 'Select/Dropdown',
    selector: 'lx-select',
    checks: [
      {
        name: 'Selectores en uso',
        test: () => countMatches('<lx-select\\|<lx-cascade-select', 'client/angular/src/app') >= 1,
        weight: 25,
      },
      {
        name: 'Sin p-dropdown directo',
        test: () => countMatches('<p-dropdown', 'client/angular/src/app/apps') === 0,
        weight: 25,
      },
      {
        name: 'ARIA presente',
        test: () => countMatches('role=\\|aria-', 'client/angular/src/app/shared/ui/adaptive/cascade-select') >= 1,
        weight: 25,
      },
      {
        name: 'Tipado estricto',
        test: () => countMatches(': any', 'client/angular/src/app/shared/ui/adaptive/cascade-select') === 0,
        weight: 25,
      },
    ],
  },

  {
    id: 'CORE-07',
    name: 'Checkbox',
    selector: 'lx-checkbox',
    checks: [
      {
        name: 'Selectores en uso',
        test: () => countMatches('<lx-checkbox', 'client/angular/src/app') >= 1,
        weight: 33,
      },
      {
        name: 'ARIA aria-checked presente',
        test: () => countMatches('aria-checked', 'client/angular/src/app/shared/ui/adaptive/checkbox') >= 1,
        weight: 33,
      },
      {
        name: 'Tipado estricto',
        test: () => countMatches(': any', 'client/angular/src/app/shared/ui/adaptive/checkbox') === 0,
        weight: 34,
      },
    ],
  },

  {
    id: 'CORE-08',
    name: 'Radio Button',
    selector: 'lx-radio-button',
    checks: [
      {
        name: 'Selectores en uso',
        test: () => countMatches('<lx-radio-button', 'client/angular/src/app') >= 1,
        weight: 33,
      },
      {
        name: 'ARIA aria-checked presente',
        test: () => countMatches('aria-checked', 'client/angular/src/app/shared/ui/adaptive/radio-button') >= 1,
        weight: 33,
      },
      {
        name: 'Tipado estricto',
        test: () => countMatches(': any', 'client/angular/src/app/shared/ui/adaptive/radio-button') === 0,
        weight: 34,
      },
    ],
  },

  {
    id: 'CORE-09',
    name: 'Card',
    selector: 'lx-card',
    checks: [
      {
        name: 'Selectores en uso',
        test: () => countMatches('<lx-card', 'client/angular/src/app') >= 1,
        weight: 50,
      },
      {
        name: 'Tipado estricto',
        test: () => countMatches(': any', 'client/angular/src/app/shared/ui/adaptive/card') === 0,
        weight: 50,
      },
    ],
  },

  {
    id: 'CORE-10',
    name: 'Tabs',
    selector: 'lx-tabs',
    checks: [
      {
        name: 'Selectores en uso',
        test: () => countMatches('<lx-tabs', 'client/angular/src/app') >= 1,
        weight: 50,
      },
      {
        name: 'Tipado estricto',
        test: () => countMatches(': any', 'client/angular/src/app/shared/ui/adaptive/tabs') === 0,
        weight: 50,
      },
    ],
  },

  {
    id: 'CORE-11',
    name: 'Toast/Notificación',
    selector: 'lx-toast (via ToastService)',
    checks: [
      {
        name: 'ToastService en uso',
        test: () => countMatches('ToastService', 'client/angular/src/app') >= 1,
        weight: 50,
      },
      {
        name: 'Tipado estricto',
        test: () => countMatches(': any', 'client/angular/src/app/shared/ui/adaptive') <= 50,
        weight: 50,
      },
    ],
  },

  {
    id: 'CORE-12',
    name: 'Spinner',
    selector: 'lx-spinner',
    checks: [
      {
        name: 'Selectores en uso',
        test: () => countMatches('<lx-spinner', 'client/angular/src/app') >= 1,
        weight: 50,
      },
      {
        name: 'Tipado estricto',
        test: () => countMatches(': any', 'client/angular/src/app/shared/ui/adaptive/spinner') === 0,
        weight: 50,
      },
    ],
  },

  {
    id: 'CORE-13',
    name: 'Breadcrumbs',
    selector: 'lx-breadcrumbs',
    checks: [
      {
        name: 'Selectores en uso',
        test: () => countMatches('<lx-breadcrumbs', 'client/angular/src/app') >= 1,
        weight: 50,
      },
      {
        name: 'ARIA aria-label presente',
        test: () => countMatches('aria-label.*ruta\\|aria-label.*migaja', 'client/angular/src/app/shared/ui/adaptive/breadcrumbs') >= 1,
        weight: 50,
      },
    ],
  },

  {
    id: 'CORE-14',
    name: 'Avatar',
    selector: 'lx-avatar',
    checks: [
      {
        name: 'Selectores en uso',
        test: () => countMatches('<lx-avatar', 'client/angular/src/app') >= 1,
        weight: 50,
      },
      {
        name: 'Tipado estricto',
        test: () => countMatches(': any', 'client/angular/src/app/shared/ui/adaptive/avatar') === 0,
        weight: 50,
      },
    ],
  },

  {
    id: 'CORE-15',
    name: 'Empty State',
    selector: 'lx-empty-state',
    checks: [
      {
        name: 'Selectores en uso',
        test: () => countMatches('<lx-empty-state', 'client/angular/src/app') >= 1,
        weight: 50,
      },
      {
        name: 'Tipado estricto',
        test: () => countMatches(': any', 'client/angular/src/app/shared/ui/adaptive/empty-state') === 0,
        weight: 50,
      },
    ],
  },

  {
    id: 'CORE-16',
    name: 'Action Menu (Web)',
    selector: 'app-action-menu',
    checks: [
      {
        name: 'Selector en uso',
        test: () => countMatches('<app-action-menu', 'client/angular/src/app') >= 1,
        weight: 50,
      },
      {
        name: 'Sin uso en mobile',
        test: () => {
          const result = exec(
            `grep -r "<app-data-view-mobile" client/angular/src -A20 2>/dev/null | grep -c "<app-action-menu" || echo 0`,
            true
          );
          return parseInt(result) === 0;
        },
        weight: 50,
      },
    ],
  },

  {
    id: 'CORE-17',
    name: 'Action Menu (Mobile)',
    selector: 'ili-action-menu',
    checks: [
      {
        name: 'Selector en uso',
        test: () => countMatches('<ili-action-menu', 'client/angular/src/app') >= 1,
        weight: 50,
      },
      {
        name: 'Tipado estricto',
        test: () => countMatches(': any', 'client/angular/src/app/shared/ui/mobile') <= 10,
        weight: 50,
      },
    ],
  },

  {
    id: 'CORE-18',
    name: 'Bottom Sheet',
    selector: 'ili-bottom-sheet',
    checks: [
      {
        name: 'Selector en uso (Ionic)',
        test: () => countMatches('ili-bottom-sheet\\|ion-modal', 'client/angular/src/app') >= 1,
        weight: 50,
      },
      {
        name: 'Solo en mobile',
        test: () => countMatches('ili-bottom-sheet', 'client/angular/src/app/shared/ui/mobile') >= 1,
        weight: 50,
      },
    ],
  },

  {
    id: 'CORE-19',
    name: 'Sidebar',
    selector: 'lx-sidebar',
    checks: [
      {
        name: 'Selector en uso',
        test: () => countMatches('<lx-sidebar', 'client/angular/src/app') >= 1,
        weight: 50,
      },
      {
        name: 'aria-label presente',
        test: () => countMatches('aria-label.*nav\\|role="navigation"', 'client/angular/src/app/shared/ui/adaptive/sidebar') >= 1,
        weight: 50,
      },
    ],
  },

  {
    id: 'CORE-20',
    name: 'Theme Switcher',
    selector: 'lx-theme-switcher',
    checks: [
      {
        name: 'Selector en uso',
        test: () => countMatches('<lx-theme-switcher', 'client/angular/src/app') >= 1,
        weight: 50,
      },
      {
        name: 'aria-switch presente',
        test: () => countMatches('role="switch"\\|aria-checked', 'client/angular/src/app/shared/ui/adaptive') >= 1,
        weight: 50,
      },
    ],
  },
];

// Ejecutar auditoría
log('Design System Audit Report', 'blue');
log('============================\n', 'blue');

let totalChecks = 0;
let passedChecks = 0;
let failedComponents = [];

auditMatrix.forEach((component) => {
  let componentPassed = 0;
  let componentTotal = component.checks.length;

  component.checks.forEach((check) => {
    totalChecks++;
    const result = check.test();
    if (result) {
      componentPassed++;
      passedChecks++;
    }
  });

  const status = componentPassed === componentTotal ? '✓' : '✗';
  const color = componentPassed === componentTotal ? 'green' : 'red';
  log(
    `${component.id} (${component.name}): ${componentPassed}/${componentTotal} checks ${status}`,
    color
  );

  if (componentPassed < componentTotal) {
    failedComponents.push({
      id: component.id,
      name: component.name,
      failed: componentTotal - componentPassed,
    });
  }
});

log('', 'reset');
log(`RESUMEN: ${passedChecks}/${totalChecks} checks ✓`, passedChecks === totalChecks ? 'green' : 'red');

if (failedComponents.length > 0) {
  log('\nComponentes con issues:', 'yellow');
  failedComponents.forEach((comp) => {
    log(`  - ${comp.id}: ${comp.failed} check(s) fallido(s)`, 'red');
  });
  log('\nExit code: 1 (falla en auditoría)', 'red');
  process.exit(1);
} else {
  log('Exit code: 0 (todos los checks pasan)', 'green');
  process.exit(0);
}
