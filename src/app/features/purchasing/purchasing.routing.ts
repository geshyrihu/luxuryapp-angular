import { Routes } from "@angular/router";

export const purchasingRoutes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("src/app/routing/compras.routing").then((m) => m.comprasRoutes),
  },
];
