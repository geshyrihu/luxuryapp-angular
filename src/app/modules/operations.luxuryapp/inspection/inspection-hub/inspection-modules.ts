import { InspectionModuleGroup } from "./inspection-module.model";

export const INSPECTION_MODULES: InspectionModuleGroup[] = [
  {
    label: "Administración de Recorridos",
    icon: "material-symbols-light:settings",
    cards: [
      {
        title: "Catálogo de Recorridos",
        description: "Gestión de recorridos y puntos de inspección.",
        route: "/inspections/catalog",
        icon: "material-symbols-light:route",
        color: "#1e40af",
        bgColor: "#dbeafe",
      },
      {
        title: "Informes de Inspección",
        description: "Consulta y seguimiento de informes de inspección.",
        route: "/inspections/inspection-report-list",
        icon: "material-symbols-light:fact-check",
        color: "#0f766e",
        bgColor: "#ccfbf1",
      },
      {
        title: "Áreas de Inspección (placeholder)",
        description: "Consulta del catálogo de áreas de inspección.",
        route: "/logbook/inspections-areas",
        icon: "material-symbols-light:location-on",
        color: "#92400e",
        bgColor: "#fef3c7",
      },
    ],
  },
  {
    label: "Mis Recorridos",
    icon: "material-symbols-light:person",
    cards: [
      {
        title: "Mis Recorridos (Lista)",
        description: "Consulta recorridos asignados para inspección.",
        route: "/inspections/my-inspection-list",
        icon: "material-symbols-light:view-list",
        color: "#047857",
        bgColor: "#d1fae5",
      },
      {
        title: "Ejecutar Recorrido",
        description: "Realiza un recorrido de inspección asignado.",
        route: "/inspections/my-inspection",
        icon: "material-symbols-light:fact-check",
         color: "var(--ds-ai)",
         bgColor: "var(--ds-ai-light)",
      },
    ],
  },
];

// details/:id, result/:id y qr/:code requieren parámetros; se accede a ellos desde sus flujos.
