import { Routes } from "@angular/router";
import { settingsRoutes } from "src/app/routing/settings.routing";

export const systemRoutes: Routes = [
  {
    path: "",
    children: settingsRoutes,
  },
];
