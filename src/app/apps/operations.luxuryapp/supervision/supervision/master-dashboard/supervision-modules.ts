import { SupervisionModuleGroup } from "./supervision-module.model";

export const SUPERVISION_MODULES: SupervisionModuleGroup[] = [
  // -------------------------------------------------------------
  // AGENDA Y MINUTAS
  // -------------------------------------------------------------
  {
    label: "Agenda y Minutas",
    icon: "material-symbols-light:schedule",
    cards: [
      {
        title: "Agenda de Supervision",
        description: "Registro y seguimiento de visitas y actividades de supervision por periodo.",
        route: "/supervision/supervision-agenda",
        icon: "material-symbols-light:event-available",
        color: "#1e40af",
        bgColor: "#dbeafe",
      },
      {
        title: "Resumen de Minutas",
        description: "Consulta agrupada y por listado del resumen general de minutas.",
        route: "/supervision/minutes-summary",
        icon: "material-symbols-light:description-outline",
        color: "#0f766e",
        bgColor: "#ccfbf1",
      },
      {
        title: "Presentaciones Juntas de Comite",
        description: "Visualizacion de presentaciones generadas para las juntas de comite por periodo.",
        route: "/supervision/presentaciones-juntas-comite",
        icon: "material-symbols-light:co-present",
        color: "#7c3aed",
        bgColor: "#f5f3ff",
      },
    ],
  },
  // -------------------------------------------------------------
  // RESULTADOS Y REPORTES
  // -------------------------------------------------------------
  {
    label: "Resultados y Reportes",
    icon: "material-symbols-light:bar-chart",
    cards: [
      {
        title: "Dashboard Resultado General",
        description: "Reporte consolidado de minutas, preventivos y tickets por periodo mensual.",
        route: "/supervision/general-result-dashboard",
        icon: "material-symbols-light:dashboard",
        color: "#0284c7",
        bgColor: "#e0f2fe",
      },
      {
        title: "Grafico Resultado General",
        description: "Vista grafica del desempeno general de supervision.",
        route: "/supervision/grafico-resultado-general",
        icon: "material-symbols-light:monitoring",
        color: "#0891b2",
        bgColor: "#cffafe",
      },
      {
        title: "Resultado General por Posicion",
        description: "Clasificacion de resultados de supervision por posicion operativa.",
        route: "/supervision/resultado-general-posicion",
        icon: "material-symbols-light:format-list-numbered",
        color: "#92400e",
        bgColor: "#fef3c7",
      },
      {
        title: "Evaluacion de Areas",
        description: "Detalle de evaluacion por area con drill-down a incidencias por estatus.",
        route: "/supervision/areas-evaluation",
        icon: "material-symbols-light:check-circle-outline",
        color: "#15803d",
        bgColor: "#dcfce7",
      },
      {
        title: "Reporte de Tickets",
        description: "Solicitudes, atendidas y pendientes de tickets por condominio y periodo.",
        route: "/supervision/tickets-report",
        icon: "material-symbols-light:confirmation-number",
        color: "#dc2626",
        bgColor: "#fee2e2",
      },
      {
        title: "Reporte de Supervision",
        description: "Resumen operativo de tareas pendientes y legales por condominio.",
        route: "/supervision/supervision-report",
        icon: "material-symbols-light:fact-check",
        color: "#b45309",
        bgColor: "#fef9c3",
      },
    ],
  },
];
