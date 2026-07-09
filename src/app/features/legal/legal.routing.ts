import { Routes } from "@angular/router";

export const legalRoutes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("src/app/routing/legal.routing").then((m) => m.legalRoutes),
  },
];
