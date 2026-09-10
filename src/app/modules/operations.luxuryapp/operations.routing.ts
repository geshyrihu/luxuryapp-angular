import { Routes } from "@angular/router";

export const operationsRoutes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("src/app/routing/operations.routing").then(
        (m) => m.operationsRoutes,
      ),
  },
];
