import { Routes } from "@angular/router";

export const maintenanceRoutes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("src/app/routing/maintenance.routing").then(
        (m) => m.maintenanceRoutes,
      ),
  },
];
