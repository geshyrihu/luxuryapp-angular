import path from "node:path";
import { fileURLToPath } from "node:url";

export const rootDir = path.dirname(fileURLToPath(import.meta.url));

export const sharedAliases = {
  "src/": path.resolve(rootDir, "src") + "/",
  "@core/": path.resolve(rootDir, "src/app/core") + "/",
  "@ui/": path.resolve(rootDir, "src/app/shared/ui") + "/",
  "@shared/": path.resolve(rootDir, "src/app/shared") + "/",
  "@operations.luxuryapp/":
    path.resolve(rootDir, "src/app/modules/operations.luxuryapp") + "/",
  "@legal.luxuryapp/":
    path.resolve(rootDir, "src/app/modules/legal.luxuryapp") + "/",
  "@human-resources.luxuryapp/":
    path.resolve(rootDir, "src/app/modules/human-resources.luxuryapp") + "/",
  "@purchases.luxuryapp/":
    path.resolve(rootDir, "src/app/modules/purchases.luxuryapp") + "/",
  "@collections.luxuryapp/":
    path.resolve(rootDir, "src/app/modules/collections.luxuryapp") + "/",
  "@management.luxuryapp/":
    path.resolve(rootDir, "src/app/modules/management.luxuryapp") + "/",
  "@recruitment.luxuryapp/":
    path.resolve(rootDir, "src/app/modules/recruitment.luxuryapp") + "/",
  "@supplier.luxuryapp/":
    path.resolve(rootDir, "src/app/modules/supplier.luxuryapp") + "/",
  "@accounting.luxuryapp/":
    path.resolve(rootDir, "src/app/modules/accounting.luxuryapp") + "/",
};

export const sharedOptimizeDeps = {
  entries: [],
  exclude: ["@stencil/core"],
};

export const sharedJSDOMTest = {
  globals: true,
  environment: "jsdom",
  setupFiles: ["src/test-setup.ts"],
  server: {
    deps: {
      inline: [
        /@angular/,
        /@ionic\/angular/,
        /@ionic\/angular\/standalone/,
        /@ionic\/core/,
        /@stencil\/core/,
        /angularx-flatpickr/,
        /flatpickr/,
        /ng-gallery/,
        /@ng-bootstrap/,
        /@ng-select/,
      ],
    },
  },
};
