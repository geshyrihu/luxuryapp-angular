import { Routes } from "@angular/router";
import { maintenanceRoutes as legacyMaintenanceRoutes } from "src/app/routing/maintenance.routing";

export const maintenanceRoutes: Routes = [
  {
    path: "",
    children: legacyMaintenanceRoutes,
  },
];
