import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/auth/guards/auth.guard";

export const legalRoutes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("src/app/routing/legal.routing").then((m) => m.legalRoutes),
  },
  {
    path: "employees-contracts",
    loadComponent: () =>
      import("./employees-contracts/legal-staff-board").then(
        (m) => m.LegalStaffBoard,
      ),
    canActivate: [authGuard],
    data: {
      title: "Empleados y Contratos",
      breadcrumb: "Empleados y Contratos",
    },
  },
];
