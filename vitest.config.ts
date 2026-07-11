
import angular from '@analogjs/vite-plugin-angular';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [angular()],
  resolve: {
    alias: {
      'src/': resolve(__dirname, 'src') + '/',
      '@core/': resolve(__dirname, 'src/app/core') + '/',
      '@ui/': resolve(__dirname, 'src/app/shared/ui') + '/',
    },
  },
  optimizeDeps: {
    entries: [],
    exclude: ['@stencil/core'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', 'android', 'ios'],
    reporters: ['default'],
    server: {
      deps: {
        inline: [
          /@angular/,
          /primeng/,
          /@primeicons/,
          /@primeuix/,
          /@ionic\/angular/,
          /@ionic\/angular\/standalone/,
          /@ionic\/core/,
          /@stencil\/core/,
          /angularx-flatpickr/,
          /flatpickr/,
        ],
      },
    },
  },
});
