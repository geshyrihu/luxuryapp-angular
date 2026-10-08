import angular from "@analogjs/vite-plugin-angular";
import { defineConfig } from "vitest/config";
import {
  sharedAliases,
  sharedJSDOMTest,
  sharedOptimizeDeps,
} from "./vitest.shared";

export default defineConfig({
  resolve: { alias: sharedAliases },
  optimizeDeps: sharedOptimizeDeps,
  test: {
    reporters: ["default"],
    maxWorkers: 4,
    projects: [
      {
        extends: true,
        plugins: [angular()],
        test: {
          name: "unit",
          ...sharedJSDOMTest,
          include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
          exclude: [
            "node_modules",
            "dist",
            "android",
            "ios",
            "src/app/modules/supplier.luxuryapp/provider/**",
            "src/app/modules/supplier.luxuryapp/providers/**",
            "src/app/core/layout/employee-view/**",
            "src/app/modules/accounting.luxuryapp/ar/**",
            "src/app/modules/accounting.luxuryapp/general-ledger/aspel-*/**",
          ],
        },
      },
    ],
  },
});
