import angular from '@analogjs/vite-plugin-angular';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { storybookAngularVitest } from "@storybook/angular-vite/vitest";
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const jsdomTestShared = {
  globals: true,
  environment: 'jsdom',
  setupFiles: ['src/test-setup.ts'],
  server: {
    deps: {
       inline: [/@angular/, /@ionic\/angular/, /@ionic\/angular\/standalone/, /@ionic\/core/, /@stencil\/core/, /angularx-flatpickr/, /flatpickr/, /ng-gallery/, /@ng-bootstrap/, /@ng-select/]
    }
  }
};

// The supplier module has two parallel component trees with duplicated selectors:
//   modules/supplier.luxuryapp/provider/*  (singular)
//   modules/supplier.luxuryapp/providers/provider/* (plural)
// The analog selector guard maintains a per-vite-server registry, so both trees
// can never be transformed in the same project. Split them into isolated
// projects, each with its own angular() plugin instance (fresh registry).
export default defineConfig({
  resolve: {
    alias: {
      'src/': resolve(__dirname, 'src') + '/',
      '@core/': resolve(__dirname, 'src/app/core') + '/',
      '@ui/': resolve(__dirname, 'src/app/shared/ui') + '/',
      '@shared/': resolve(__dirname, 'src/app/shared') + '/',
      '@operations.luxuryapp/': resolve(__dirname, 'src/app/modules/operations.luxuryapp') + '/',
      '@legal.luxuryapp/': resolve(__dirname, 'src/app/modules/legal.luxuryapp') + '/',
      '@management.luxuryapp/': resolve(__dirname, 'src/app/modules/management.luxuryapp') + '/',
      '@recruitment.luxuryapp/': resolve(__dirname, 'src/app/modules/recruitment.luxuryapp') + '/',
      '@supplier.luxuryapp/': resolve(__dirname, 'src/app/modules/supplier.luxuryapp') + '/',
      '@accounting.luxuryapp/': resolve(__dirname, 'src/app/modules/accounting.luxuryapp') + '/'
    }
  },
  optimizeDeps: {
    entries: [],
    exclude: ['@stencil/core']
  },
  test: {
    reporters: ['default'],
    // En Windows el paralelismo alto (~un worker por CPU) deja la suite inestable
    // (EBUSY en cache de vite, timeouts esporadicos de 5s). 4 workers = verde y estable.
    maxWorkers: 4,
    projects: [{
      extends: true,
      plugins: [angular()],
      test: {
        name: 'unit',
        ...jsdomTestShared,
        include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        exclude: [
          'node_modules', 'dist', 'android', 'ios',
          'src/app/modules/supplier.luxuryapp/provider/**',
          'src/app/modules/supplier.luxuryapp/providers/**',
          'src/app/core/layout/employee-view/**',
          'src/app/modules/accounting.luxuryapp/ar/**',
          'src/app/modules/accounting.luxuryapp/general-ledger/aspel-*/**'
        ]
      }
    }, {
      extends: true,
      plugins: [angular()],
      test: {
        name: 'supplier-provider',
        ...jsdomTestShared,
        include: ['src/app/modules/supplier.luxuryapp/provider/**/*.spec.ts'],
        exclude: ['node_modules']
      }
    }, {
      extends: true,
      plugins: [angular()],
      test: {
        name: 'supplier-providers',
        ...jsdomTestShared,
        include: ['src/app/modules/supplier.luxuryapp/providers/**/*.spec.ts'],
        exclude: ['node_modules']
      }
    }, {
      extends: true,
      plugins: [angular()],
      test: {
        name: 'employee-layout',
        ...jsdomTestShared,
        include: ['src/app/core/layout/employee-view/**/*.spec.ts'],
        exclude: ['node_modules']
      }
    }, {
      extends: true,
      plugins: [angular()],
      test: {
        name: 'accounting-aspel-ar',
        ...jsdomTestShared,
        include: ['src/app/modules/accounting.luxuryapp/ar/**/*.spec.ts'],
        exclude: ['node_modules']
      }
    }, {
      extends: true,
      plugins: [angular()],
      test: {
        name: 'accounting-aspel-general-ledger',
        ...jsdomTestShared,
        include: ['src/app/modules/accounting.luxuryapp/general-ledger/aspel-*/**/*.spec.ts'],
        exclude: ['node_modules']
      }
    }, {
      extends: true,
      plugins: [// Forwards Angular build options (styles, assets, zoneless, …) into standalone vitest runs
      storybookAngularVitest({}),
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});
