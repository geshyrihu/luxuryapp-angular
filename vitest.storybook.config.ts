import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { storybookAngularVitest } from "@storybook/angular-vite/vitest";
import { playwright } from "@vitest/browser-playwright";
import path from "node:path";
import { defineConfig } from "vitest/config";
import { rootDir, sharedAliases, sharedOptimizeDeps } from "./vitest.shared";

export default defineConfig({
  resolve: { alias: sharedAliases },
  optimizeDeps: sharedOptimizeDeps,
  test: {
    reporters: ["default"],
    projects: [
      {
        extends: true,
        plugins: [
          // Forwards Angular build options into the standalone Storybook run.
          storybookAngularVitest({}),
          storybookTest({ configDir: path.join(rootDir, ".storybook") }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
