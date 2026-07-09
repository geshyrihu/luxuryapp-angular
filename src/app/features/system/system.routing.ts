import { Routes } from "@angular/router";

export const systemRoutes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("src/app/routing/settings.routing").then((m) => m.settingsRoutes),
  },
];
