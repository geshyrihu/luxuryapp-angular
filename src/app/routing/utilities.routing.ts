import { Routes } from "@angular/router";
import { authGuard } from "@core/auth/guards/auth.guard";
export const utilitiesRoutes: Routes = [
  {
    path: "calculate-vat", // Ruta anterior: 'calcular-iva'
    loadComponent: () =>
      import("@operations.luxuryapp/inventory/tools/calculator-list").then(
        (m) => m.CalculatorList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Calcular IVA",
      breadcrumb: "Calcular IVA",
    },
  },
];


