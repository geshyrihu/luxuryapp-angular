import angular from "@analogjs/vite-plugin-angular";
import { defineConfig } from "vitest/config";
import {
  sharedAliases,
  sharedJSDOMTest,
  sharedOptimizeDeps,
} from "./vitest.shared";

// Each scope needs its own Angular plugin instance because duplicate selectors
// exist across the parallel supplier trees and other isolated suites.
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
          name: "supplier-provider",
          ...sharedJSDOMTest,
          include: ["src/app/modules/supplier.luxuryapp/provider/**/*.spec.ts"],
          exclude: ["node_modules"],
        },
      },
      {
        extends: true,
        plugins: [angular()],
        test: {
          name: "supplier-providers",
          ...sharedJSDOMTest,
          include: [
            "src/app/modules/supplier.luxuryapp/providers/**/*.spec.ts",
          ],
          exclude: ["node_modules"],
        },
      },
      {
        extends: true,
        plugins: [angular()],
        test: {
          name: "employee-layout",
          ...sharedJSDOMTest,
          include: ["src/app/core/layout/employee-view/**/*.spec.ts"],
          exclude: ["node_modules"],
        },
      },
      {
        extends: true,
        plugins: [angular()],
        test: {
          name: "accounting-aspel-ar",
          ...sharedJSDOMTest,
          include: ["src/app/modules/accounting.luxuryapp/ar/**/*.spec.ts"],
          exclude: ["node_modules"],
        },
      },
      {
        extends: true,
        plugins: [angular()],
        test: {
          name: "accounting-aspel-general-ledger",
          ...sharedJSDOMTest,
          include: [
            "src/app/modules/accounting.luxuryapp/general-ledger/aspel-*/**/*.spec.ts",
          ],
          exclude: ["node_modules"],
        },
      },
    ],
  },
});
