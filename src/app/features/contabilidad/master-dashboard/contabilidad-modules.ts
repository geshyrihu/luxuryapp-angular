import { ContabilidadModuleGroup } from "./contabilidad-module.model";

export const CONTABILIDAD_MODULES: ContabilidadModuleGroup[] = [
  // ─────────────────────────────────────────────────────────────
  // CONTABILIDAD GENERAL
  // ─────────────────────────────────────────────────────────────
  {
    label: "Contabilidad General",
    icon: "pi pi-chart-bar",
    cards: [
      {
        title: "Catálogo Contable",
        description: "Gestión de cuentas contables y catálogo de cuentas COI.",
        route: "/contabilidad/accounting-catalog",
        icon: "pi pi-book",
        color: "#1e40af",
        bgColor: "#dbeafe",
      },
      {
        title: "END PIONTS Aspel",
        description:
          "Consulta pendientes por concepto de cobranza Haus desde Aspel COI.",
        route: "/contabilidad/aspel-cobranza",
        icon: "pi pi-wallet",
        color: "#0f766e",
        bgColor: "#ccfbf1",
      },
      {
        title: "Reporte General de envío Edos. Financieros",
        description: "Configuración de envío de reportes a financieros.",
        route: "/contabilidad/financial-report-sending",
        icon: "pi pi-envelope",
        color: "#0284c7",
        bgColor: "#e0f2fe",
      },
      {
        title: "Envío Edos. Financieros",
        description: "Configuración de envío de reportes a financieros.",
        route: "/contabilidad/financial-statements",
        icon: "pi pi-envelope",
        color: "#0284c7",
        bgColor: "#e0f2fe",
      },
      {
        title: "Pendientes de Minutas",
        description: "Seguimiento a pendientes de juntas y minutas.",
        route: "/contabilidad/minutes-pendings",
        icon: "pi pi-history",
        color: "#92400e",
        bgColor: "#fef3c7",
      },
      {
        title: "Estados Financieros Online",
        description: "Reportes y estados financieros dinámicos.",
        route: "/contabilidad/financial-statements-reports",
        icon: "pi pi-chart-line",
        color: "#0891b2",
        bgColor: "#cffafe",
      },
      // {
      //   title: "Estados Financieros Online V2",
      //   description: "Sandbox del nuevo Estado de Resultados sin afectar la versiÃ³n actual.",
      //   route: "/contabilidad/financial-statements-reports-v2",
      //   icon: "pi pi-chart-line",
      //   color: "#1d4ed8",
      //   bgColor: "#dbeafe",
      // },
      // {
      //   title: "Reportes Dinámicos",
      //   description:
      //     "Configuración y visor de reportes financieros personalizados.",
      //   route: "/contabilidad/reportes",
      //   icon: "pi pi-cog",
      //   color: "#7c3aed",
      //   bgColor: "#f5f3ff",
      // },
      // {
      //   title: "Auditoría de Sincronización",
      //   description: "Consultar datos de sincronización Aspel por entidad.",
      //   route: "/contabilidad/migration-test",
      //   icon: "pi pi-search",
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
    icon: "pi pi-chart-bar",
    cards: [
      {
        title: "Propuesta Presupuesto Nuevo",
        description: "Elaboración y gestión de propuestas presupuestales.",
        route: "/contabilidad/budget-proposal",
        icon: "pi pi-file-edit",
        color: "#3730a3",
        bgColor: "#e0e7ff",
      },
      {
        title: "Presupuesto Espejo Aspel",
        description: "Ejercicio fiscal y presupuesto en Aspel.",
        route: "/contabilidad/budget",
        icon: "pi pi-briefcase",
        color: "#1e3a8a",
        bgColor: "#dbeafe",
      },
      {
        title: "Cobranza Online",
        description: "Gestión y seguimiento de cuentas por cobrar.",
        route: "/contabilidad/collections",
        icon: "pi pi-wallet",
        color: "#047857",
        bgColor: "#d1fae5",
      },
      // {
      //   title: "Cobranza Nativa",
      //   description: "Gestión y seguimiento de cuentas por cobrar.",
      //   route: "/cobranza-nativa",
      //   icon: "pi pi-bolt",
      //   color: "#0f766e",
      //   bgColor: "#ccfbf1",
      // },
      // {
      //   title: "Espejo Aspel Full",
      //   description:
      //     "Catalogo completo de cuentas Aspel con cargos, abonos y presupuesto mensual por grupo.",
      //   route: "/contabilidad/espejo-aspel-full",
      //   icon: "pi pi-table",
      //   color: "#0f172a",
      //   bgColor: "#f1f5f9",
      // },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // COBRANZA NATIVA
  // ─────────────────────────────────────────────────────────────
  // {
  //   label: "Cobranza Nativa",
  //   icon: "pi pi-bolt",
  //   cards: [
  //     {
  //       title: "Dashboard de Métricas",
  //       description: "KPIs de cobranza: porcentaje de cobro, totales y top deudores.",
  //       route: "/cobranza-nativa/dashboard",
  //       icon: "pi pi-chart-bar",
  //       color: "#0f766e",
  //       bgColor: "#ccfbf1",
  //     },
  //     {
  //       title: "Plantillas de Cargos",
  //       description: "Configuración de cargos recurrentes por indiviso o monto fijo.",
  //       route: "/cobranza-nativa/charge-templates",
  //       icon: "pi pi-pencil",
  //       color: "#15803d",
  //       bgColor: "#dcfce7",
  //     },
  //     {
  //       title: "Cargos",
  //       description: "Gestión de cargos aplicados a condóminos e importación masiva.",
  //       route: "/cobranza-nativa/charges",
  //       icon: "pi pi-dollar",
  //       color: "#166534",
  //       bgColor: "#bbf7d0",
  //     },
  //     {
  //       title: "Registrar Pagos",
  //       description: "Registro de pagos con asignación automática FIFO a cargos.",
  //       route: "/cobranza-nativa/payments",
  //       icon: "pi pi-credit-card",
  //       color: "#047857",
  //       bgColor: "#a7f3d0",
  //     },
  //     {
  //       title: "Políticas de Mora",
  //       description: "Configuración de recargos: días de gracia, tasa, interés compuesto.",
  //       route: "/cobranza-nativa/late-fee-policies",
  //       icon: "pi pi-exclamation-triangle",
  //       color: "#7c2d12",
  //       bgColor: "#fed7aa",
  //     },
  //     {
  //       title: "Estado de Cuenta Nativo",
  //       description: "Kardex de movimientos por propiedad con exportación PDF.",
  //       route: "/cobranza-nativa/estado-cuenta",
  //       icon: "pi pi-copy",
  //       color: "#0891b2",
  //       bgColor: "#cffafe",
  //     },
  //     {
  //       title: "Demo Cobranza",
  //       description: "Simulación interactiva del sistema de cobranza nativa.",
  //       route: "/cobranza-nativa/demo",
  //       icon: "pi pi-graduation-cap",
  //       color: "#6b7280",
  //       bgColor: "#f3f4f6",
  //     },
  //   ],
  // },
];
