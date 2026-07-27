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
export default defineConfig({
  plugins: [angular()],
  resolve: {
    alias: {
      'src/': resolve(__dirname, 'src') + '/',
      '@core/': resolve(__dirname, 'src/app/core') + '/',
      '@ui/': resolve(__dirname, 'src/app/shared/ui') + '/'
    }
  },
  optimizeDeps: {
    entries: [],
    exclude: ['@stencil/core']
  },
  test: {
    reporters: ['default'],
    projects: [{
      extends: true,
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['src/test-setup.ts'],
        include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        exclude: ['node_modules', 'dist', 'android', 'ios'],
        server: {
          deps: {
            inline: [/@angular/, /primeng/, /@primeicons/, /@primeuix/, /@ionic\/angular/, /@ionic\/angular\/standalone/, /@ionic\/core/, /@stencil\/core/, /angularx-flatpickr/, /flatpickr/]
          }
        }
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