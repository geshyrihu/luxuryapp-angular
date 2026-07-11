import { Routes } from "@angular/router";

export const accountingRoutes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("src/app/routing/accounting.routing").then(
        (m) => m.accountingRoutes,
      ),
  },
];
