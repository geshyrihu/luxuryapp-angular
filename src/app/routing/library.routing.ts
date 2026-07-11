import { Routes } from "@angular/router"; // Trivial change to force re-evaluation
import { authGuard } from "src/app/core/auth/guards/auth.guard";
import { superUserGuard } from "src/app/core/auth/guards/super-user.guard";
import { EDocumentType } from "src/app/apps/legal.luxuryapp/asuntos-legales-y-seguros/interfaces/document-type.enum";
export const libraryRoutes: Routes = [
  {
    path: "incorporation-deed", // Ruta anterior: 'acta-constitutiva'
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/custom-documents/custom-document/acta-constitutiva-list").then(
        (m) => m.ActaConstitutivaList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Acta constitutiva",
      breadcrumb: "Acta constitutiva",
    },
  },

  {
    path: "financial-report",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/manuals/biblioteca/financial-report/informe-financiero-list").then(
        (m) => m.InformeFinanciero,
      ),
    canActivate: [authGuard],
    data: {
      title: "Informe Financiero", // Ajustado a mayúsculas
      breadcrumb: "Informe Financiero",
    },
  },

  {
    path: "templates",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/templates/templates-list").then(
        (m) => m.TemplatesList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Formatos",
      breadcrumb: "Formatos",
    },
  },
  {
    path: "manuals-and-processes",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/manuals/biblioteca/manuals-and-processes/pages/manuals-and-processes-list").then(
        (m) => m.ManualsAndProcessesList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Manuales y Procesos",
      breadcrumb: "Manuales y Procesos",
    },
  },
  {
    path: "manuals-and-processes/guide",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/manuals/biblioteca/manuals-and-processes/pages/manuals-and-processes-guide/manuals-and-processes-guide").then(
        (m) => m.ManualsAndProcessesGuide,
      ),
    canActivate: [authGuard],
    data: {
      title: "Guía del Módulo",
      breadcrumb: "Guía",
    },
  },
  {
    path: "manuals-and-processes/detail/:id",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/manuals/biblioteca/manuals-and-processes/pages/manuals-and-processes-detail").then(
        (m) => m.ManualsAndProcessesDetail,
      ),
    canActivate: [authGuard],
    data: {
      title: "Detalle de Manual",
      breadcrumb: "Detalle",
    },
  },
  {
    path: "manuals-and-processes/editor/:id",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/manuals/biblioteca/manuals-and-processes/pages/manuals-and-processes-editor/manuals-and-processes-editor").then(
        (m) => m.ManualsAndProcessesEditor,
      ),
    canActivate: [authGuard, superUserGuard],
    data: {
      title: "Editor de Manual",
      breadcrumb: "Editor",
    },
  },
  {
    path: "manuals-and-processes/flowchart-editor/:id",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/manuals/biblioteca/manuals-and-processes/pages/manual-flowchart-editor/manual-flowchart-editor").then(
        (m) => m.ManualFlowchartEditor,
      ),
    canActivate: [authGuard, superUserGuard],
    data: {
      title: "Editor de Diagrama",
      breadcrumb: "Diagrama",
    },
  },
  {
    path: "maintenance-policies",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/custom-documents/custom-document/policy-contract/policy-contract-list").then(
        (m) => m.PolicyContractList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Contratos y Pólizas",
      breadcrumb: "Contratos y Pólizas",
    },
  },

  {
    path: "contracts-policies-view-legal",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/reports/contracts-policies/contracts-policies").then(
        (m) => m.ContractsPolicies,
      ),
    canActivate: [authGuard],
    data: {
      title: "Vista de Contratos y Pólizas", // Ajustado para diferenciar de la ruta anterior
      breadcrumb: "Vista de Contratos y Pólizas",
    },
  },

  {
    path: "assemblies", // Ruta anterior: 'asambleas'
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/custom-documents/custom-document/asambleas-list").then(
        (m) => m.Asambleas,
      ),
    canActivate: [authGuard],
    data: {
      title: "Asambleas",
      breadcrumb: "Asambleas",
    },
  },
  {
    path: "regulations", // Ruta anterior: 'reglamentos'
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/custom-documents/custom-document/reglamentos-list").then(
        (m) => m.Reglamentos,
      ),
    canActivate: [authGuard],
    data: {
      title: "Reglamentos",
      breadcrumb: "Reglamentos",
    },
  },
  {
    path: "ravine-concession", // Ruta anterior: 'concesion-barranca'
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/custom-documents/custom-document/special-document-list").then(
        (m) => m.SpecialDocumentList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Concesión Barranca",
      breadcrumb: "Concesión Barranca",
      documentType: EDocumentType.ConcesionBarranca,
    },
  },
  {
    path: "well-concession", // Ruta anterior: 'concesion-pozo'
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/custom-documents/custom-document/special-document-list").then(
        (m) => m.SpecialDocumentList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Concesión Pozo",
      breadcrumb: "Concesión Pozo",
      documentType: EDocumentType.ConcesionPozo,
    },
  },

  {
    path: "painting", // Ruta anterior: 'pintura' (Note: using painting to match DB standard)
    loadComponent: () =>
      import("src/app/apps/supplier.luxuryapp/paint-inventory/inventario-pintura").then(
        (m) => m.InventarioPintura,
      ),
    canActivate: [authGuard],
    data: {
      title: "Inventario de Pintura", // Ajustado para mayor claridad
      breadcrumb: "Inventario de Pintura",
    },
  },
  {
    path: "lighting", // Ruta anterior: 'iluminacion'
    loadComponent: () =>
      import("src/app/apps/supplier.luxuryapp/lighting-inventory/inventario-iluminacion").then(
        (m) => m.InventarioIluminacion,
      ),
    canActivate: [authGuard],
    data: {
      title: "Inventario de Iluminación", // Ajustado para mayor claridad
      breadcrumb: "Inventario de Iluminación",
    },
  },
];
