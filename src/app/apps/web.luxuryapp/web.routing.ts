import { Routes } from "@angular/router";

export const webRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("src/app/apps/web.luxuryapp/landing/landing-page").then(
        (m) => m.LandingPage,
      ),
    data: { title: "Inicio", breadcrumb: "Inicio" },
  },
  {
    path: "legal",
    loadComponent: () =>
      import("src/app/apps/web.luxuryapp/legal/legal-page").then(
        (m) => m.LegalPage,
      ),
    data: { title: "Legal", breadcrumb: "Legal" },
  },
  {
    path: "operations",
    loadComponent: () =>
      import("src/app/apps/web.luxuryapp/operations/operations-page").then(
        (m) => m.OperationsPage,
      ),
    data: { title: "Operaciones", breadcrumb: "Operaciones" },
  },
  {
    path: "maintenance",
    loadChildren: () =>
      import("src/app/apps/web.luxuryapp/maintenance/maintenance.routing").then(
        (m) => m.maintenanceRoutes,
      ),
    data: { title: "Mantenimiento", breadcrumb: "Mantenimiento" },
  },
  {
    path: "accounting",
    loadComponent: () =>
      import("src/app/apps/web.luxuryapp/accounting/accounting-page").then(
        (m) => m.AccountingPage,
      ),
    data: { title: "Contabilidad", breadcrumb: "Contabilidad" },
  },
  {
    path: "hr",
    loadComponent: () =>
      import("src/app/apps/web.luxuryapp/hr/hr-page").then(
        (m) => m.HrPage,
      ),
    data: { title: "Recursos Humanos", breadcrumb: "Recursos Humanos" },
  },
];
