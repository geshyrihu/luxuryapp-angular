import { Routes } from "@angular/router";
import { accountingRoutes as legacyAccountingRoutes } from "src/app/routing/accounting.routing";

export const accountingRoutes: Routes = [
  {
    path: "",
    children: legacyAccountingRoutes,
  },
];
