import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/guard/auth.guard";
export const fundingRoutes: Routes = [
  {
    path: "list",
    loadComponent: () =>
      import("src/app/features/funding/funding-list").then(
        (m) => m.FundingList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Fondeos contables",
      breadcrumb: "Fondeos contables",
    },
  },
  {
    path: "details/:id",
    loadComponent: () =>
      import("src/app/features/funding/funding-detail").then(
        (m) => m.FundingDetail,
      ),
    canActivate: [authGuard],
    data: {
      title: "Detalle",
      breadcrumb: "Detalle",
    },
  },
];










