import { Routes } from "@angular/router";
import { authGuard } from "@core/auth/guards/auth.guard";
export const fundingRoutes: Routes = [
  {
    path: "list",
    loadComponent: () =>
      import("@accounting.luxuryapp/fondeos-y-reporteo/funding/funding-list").then(
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
      import("@accounting.luxuryapp/fondeos-y-reporteo/funding/funding-detail").then(
        (m) => m.FundingDetail,
      ),
    canActivate: [authGuard],
    data: {
      title: "Detalle",
      breadcrumb: "Detalle",
    },
  },
];


