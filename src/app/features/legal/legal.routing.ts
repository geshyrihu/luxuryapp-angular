import { Routes } from "@angular/router";
import { legalRoutes as legacyLegalRoutes } from "src/app/routing/legal.routing";

export const legalRoutes: Routes = [
  {
    path: "",
    children: legacyLegalRoutes,
  },
];
