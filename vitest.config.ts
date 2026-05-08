
import angular from '@analogjs/vite-plugin-angular';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [angular()],
  resolve: {
    alias: {
      'src/': resolve(__dirname, 'src') + '/',
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
        inline: [/@angular/, /primeng/],
      },
    },
  },
});
