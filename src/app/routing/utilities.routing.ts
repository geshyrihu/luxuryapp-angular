import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/guard/auth.guard";
export const utilitiesRoutes: Routes = [
  {
    path: "calculate-vat", // Ruta anterior: 'calcular-iva'
    loadComponent: () =>
      import("src/app/features/tools/calculator-list").then(
        (m) => m.CalculatorList
      ),
    canActivate: [authGuard],
    data: {
      title: "Calcular IVA",
      breadcrumb: "Calcular IVA",
    },
  },
];










