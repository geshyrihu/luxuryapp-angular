import { Routes } from "@angular/router";
export const SAT_FUNDING_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./sat-funding-list/sat-funding-list").then(
        (m) => m.SatFundingListComponent
      ),
    data: {
      title: "Fondeos SAT",
      breadcrumb: "Fondeos SAT",
    },
  },
  {
    path: ":id",
    loadComponent: () =>
      import("./sat-funding-detail/sat-funding-detail").then(
        (m) => m.SatFundingDetailComponent
      ),
    data: {
      title: "Detalle de Fondeo",
      breadcrumb: "Detalle de Fondeo",
    },
  },
];









