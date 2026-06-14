import { Routes } from "@angular/router";
import { operationsRoutes as legacyOperationsRoutes } from "src/app/routing/operations.routing";

export const operationsRoutes: Routes = [
  {
    path: "",
    children: legacyOperationsRoutes,
  },
];
