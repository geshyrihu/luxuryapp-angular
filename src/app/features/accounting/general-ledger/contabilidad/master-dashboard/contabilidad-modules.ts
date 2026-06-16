import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { ContabilidadModuleGroup } from "./contabilidad-module.model";

export const CONTABILIDAD_MODULES: ContabilidadModuleGroup[] = [
  // ─────────────────────────────────────────────────────────────
  // CONTABILIDAD GENERAL
  // ─────────────────────────────────────────────────────────────
  {
    label: "Contabilidad General",
    icon: "mdi:chart-bar",
    cards: [
      {
        title: "Catálogo Contable",
        description: "Gestión de cuentas contables y catálogo de cuentas COI.",
        route: "/contabilidad/accounting-catalog",
        icon: "mdi:book",
        color: "#1e40af",
        bgColor: "#dbeafe",
      },
      {
        title: "END PIONTS Aspel",
        description:
          "Consulta pendientes por concepto de cobranza Haus desde Aspel COI.",
        route: "/contabilidad/aspel-cobranza",
        icon: "mdi:wallet",
        color: "#0f766e",
        bgColor: "#ccfbf1",
      },
      {
        title: "Reporte General de envío Edos. Financieros",
        description: "Configuración de envío de reportes a financieros.",
        route: "/contabilidad/financial-report-sending",
        icon: "mdi:email-outline",
        color: "#0284c7",
        bgColor: "#e0f2fe",
      },
      {
        title: "Envío Edos. Financieros",
        description: "Configuración de envío de reportes a financieros.",
        route: "/contabilidad/financial-statements",
        icon: "mdi:email-outline",
        color: "#0284c7",
        bgColor: "#e0f2fe",
      },
      {
        title: "Pendientes de Minutas",
        description: "Seguimiento a pendientes de juntas y minutas.",
        route: "/contabilidad/minutes-pendings",
        icon: "mdi:history",
        color: "#92400e",
        bgColor: "#fef3c7",
      },
      {
        title: "Estados Financieros Online",
        description: "Reportes y estados financieros dinámicos.",
        route: "/contabilidad/financial-statements-reports",
        icon: "mdi:chart-line",
        color: "#0891b2",
        bgColor: "#cffafe",
      },
      // {
      //   title: "Estados Financieros Online V2",
      //   description: "Sandbox del nuevo Estado de Resultados sin afectar la versión actual.",
      //   route: "/contabilidad/financial-statements-reports-v2",
      //   icon: "mdi:chart-line",
      //   color: "#1d4ed8",
      //   bgColor: "#dbeafe",
      // },
      {
        title: "Reportes Dinámicos",
        description:
          "Configuración y visor de reportes financieros personalizados.",
        route: "/contabilidad/reportes",
        icon: "mdi:cog",
        color: "#7c3aed",
        bgColor: "#f5f3ff",
      },
      {
        title: "Presentaciones de Junta de Comité",
        description:
          "Gestión y visualización de presentaciones para juntas de comité.",
        route: "/committee-meetings/presentations-contador",
        icon: "mdi:presentation",
        color: "#c026d3",
        bgColor: "#fae8ff",
        roles: [EApplicationRole.Contador, EApplicationRole.SuperUsuario],
      },
      // {
      //   title: "Auditoría de Sincronización",
      //   description: "Consultar datos de sincronización Aspel por entidad.",
      //   route: "/contabilidad/migration-test",
      //   icon: "mdi:magnify",
      //   color: "#6366f1",
      //   bgColor: "#e0e7ff",
      // },
    ],
  },
  // ─────────────────────────────────────────────────────────────
  // CONTABILIDAD PRESUPUESTAL
  // ─────────────────────────────────────────────────────────────
  {
    label: "Espejo Contabilidad Presupuestal",
    icon: "mdi:chart-bar",
    cards: [
      {
        title: "Propuesta Presupuesto Nuevo",
        description: "Elaboración y gestión de propuestas presupuestales.",
        route: "/contabilidad/budget-proposal",
        icon: "mdi:file-edit",
        color: "#3730a3",
        bgColor: "#e0e7ff",
      },
      {
        title: "Presupuesto Espejo Aspel",
        description: "Ejercicio fiscal y presupuesto en Aspel.",
        route: "/contabilidad/budget",
        icon: "mdi:briefcase",
        color: "#1e3a8a",
        bgColor: "#dbeafe",
      },
      {
        title: "Cobranza Online",
        description: "Gestión y seguimiento de cuentas por cobrar.",
        route: "/contabilidad/collections",
        icon: "mdi:wallet",
        color: "#047857",
        bgColor: "#d1fae5",
      },
      // {
      //   title: "Cobranza Nativa",
      //   description: "Gestión y seguimiento de cuentas por cobrar.",
      //   route: "/cobranza-nativa",
      //   icon: "mdi:lightning-bolt",
      //   color: "#0f766e",
      //   bgColor: "#ccfbf1",
      // },
      {
        title: "Espejo Aspel Full",
        description:
          "Catalogo completo de cuentas Aspel con cargos, abonos y presupuesto mensual por grupo.",
        route: "/contabilidad/espejo-aspel-full",
        icon: "mdi:table",
        color: "#0f172a",
        bgColor: "#f1f5f9",
      },
      {
        title: "Auditoria de Cuentas Aspel",
        description:
          "Comparativa estructural de cuentas contables entre todos los customers activos con mapeo Aspel.",
        route: "/contabilidad/autitoria-cuentas-aspel",
        icon: "mdi:sitemap",
        color: "#7c2d12",
        bgColor: "#ffedd5",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // COBRANZA
  // ─────────────────────────────────────────────────────────────
  {
    label: "Cobranza",
    icon: "mdi:wallet",
    cards: [
      {
        title: "Cuotas Vigentes",
        description: "Registro de cuotas vigentes y plantillas de cargos recurrentes.",
        route: "/cobranza-nativa/charge-templates",
        icon: "mdi:pencil-box-multiple",
        color: "#15803d",
        bgColor: "#dcfce7",
      },
    ],
  },
];
