import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/auth/guards/auth.guard";
import { CobranzaOnlineStoreService } from "./state/cobranza-online-store.service";

export const COBRANZA_ONLINE_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./cobranza-online-wrapper").then((m) => m.CobranzaOnlineWrapper),
    canActivate: [authGuard],
    data: {
      title: "Cobranza Online",
      breadcrumb: "Cobranza Online",
    },
    providers: [CobranzaOnlineStoreService],
    children: [
      {
        path: "",
        loadComponent: () =>
          import("./resumen/cobranza-online-resumen").then(
            (m) => m.CobranzaOnlineResumen,
          ),
        data: {
          title: "Resumen",
          description:
            "Dashboard principal con indicadores clave de cobranza para el periodo actual.",
          breadcrumb: "Resumen",
        },
      },
      {
        path: "analysis",
        loadComponent: () =>
          import("./analysis/cobranza-online-analysis").then(
            (m) => m.CobranzaOnlineAnalysis,
          ),
        data: {
          title: "Análisis de Cobranza",
          description:
            "Vista adicional para replicar el reporte de cartera al corte, usando saldos Aspel y cuotas vigentes definidas en ChargeTemplate.",
          breadcrumb: "Análisis de Cobranza",
        },
      },
      {
        path: "detalle-condominos",
        loadComponent: () =>
          import("./detalle-condominos/cobranza-online-detalle-condominos").then(
            (m) => m.CobranzaOnlineDetalleCondominos,
          ),
        data: {
          title: "Detalle por Condómino",
          description:
            "Cartera completa clasificada según las reglas de negocio al corte consultado.",
          breadcrumb: "Detalle por Condómino",
        },
      },
      {
        path: "morosidad",
        loadComponent: () =>
          import("./morosidad/cobranza-online-morosidad").then(
            (m) => m.CobranzaOnlineMorosidad,
          ),
        data: {
          title: "Reporte de Morosidad",
          description:
            "Análisis detallado de la deuda por departamento.",
          breadcrumb: "Reporte de Morosidad",
        },
      },
      {
        path: "otros-cargos",
        loadComponent: () =>
          import("./otros-cargos/cobranza-online-otros-cargos").then(
            (m) => m.CobranzaOnlineOtrosCargos,
          ),
        data: {
          title: "Otros Cargos",
          description:
            "Desglose de cargos especiales y extraordinarios aplicados durante el mes.",
          breadcrumb: "Otros Cargos",
        },
      },
      {
        path: "movimientos",
        loadComponent: () =>
          import("./movimientos/cobranza-online-movimientos").then(
            (m) => m.CobranzaOnlineMovimientos,
          ),
        data: {
          title: "Movimientos del Mes",
          description:
            "Desglose unificado de cargos y abonos aplicados durante el mes.",
          breadcrumb: "Movimientos del Mes",
        },
      },
      {
        path: "advances",
        loadComponent: () =>
          import("./advances/cobranza-online-advances").then(
            (m) => m.CobranzaOnlineAdvances,
          ),
        data: {
          title: "Adelantos y Saldos a Favor",
          description:
            "Residentes con saldo a favor desglosado por concepto al cierre de mes.",
          breadcrumb: "Adelantos y Saldos a Favor",
        },
      },
      {
        path: "towers",
        loadComponent: () =>
          import("./towers/cobranza-online-towers").then(
            (m) => m.CobranzaOnlineTowers,
          ),
        data: {
          title: "Resumen por Torres",
          description: "Agrupación de saldos por nivel 2 (Torre o Bloque).",
          breadcrumb: "Resumen por Torres",
        },
      },
      {
        path: "exclusions",
        loadComponent: () =>
          import("./exclusions/cobranza-online-exclusions").then(
            (m) => m.CobranzaOnlineExclusions,
          ),
        data: {
          title: "Exclusiones",
          description:
            "Cuentas excluidas del reporte de cobranza según la configuración del cliente.",
          breadcrumb: "Exclusiones",
        },
      },
      {
        path: "inspection",
        loadComponent: () =>
          import("./inspection/cobranza-online-inspection").then(
            (m) => m.CobranzaOnlineInspection,
          ),
        data: {
          title: "Listado Base (Inspección)",
          description:
            "Listado base por cuenta 104 para revisar qué cargos entran, qué pagos y su saldo individual calculado.",
          breadcrumb: "Listado Base",
        },
      },
      // Rutas legacy mantenidas para no romper deeplinks existentes
      {
        path: "reporte-financiero",
        redirectTo: "",
        pathMatch: "full",
      },
      {
        path: "debtors",
        redirectTo: "detalle-condominos",
        pathMatch: "full",
      },
      {
        path: "department-charges",
        redirectTo: "movimientos",
        pathMatch: "full",
      },
      {
        path: "department-payments",
        redirectTo: "movimientos",
        pathMatch: "full",
      },
    ],
  },
];
