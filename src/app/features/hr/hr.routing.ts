import { Routes } from "@angular/router";
import { humanResourcesRoutes } from "src/app/routing/human-resources.routing";

export const hrRoutes: Routes = [
  {
    path: "",
    children: humanResourcesRoutes,
  },
];
