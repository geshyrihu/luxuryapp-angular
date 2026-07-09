import { Routes } from "@angular/router";

export const hrRoutes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("src/app/routing/human-resources.routing").then(
        (m) => m.humanResourcesRoutes,
      ),
  },
];
