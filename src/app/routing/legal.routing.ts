import { inject } from "@angular/core";
import { Routes } from "@angular/router";
import { authGuard } from "@core/auth/guards/auth.guard";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { documentTypeRoutesConfig } from "@legal.luxuryapp/legal/interfaces/documentTypeRoutesConfig";
// Importa el componente de forma perezosa
const CustomDocumentList = () =>
  import("@legal.luxuryapp/legal/custom-documents/documento-personalizado-lista").then(
    (m) => m.DocumentoPersonalizadoLista,
  );
// Genera las rutas dinámicamente
const documentRoutes: Routes = documentTypeRoutesConfig.map((config) => ({
  path: config.routeParam, // Usa el nombre de la carpeta como la ruta
  loadComponent: CustomDocumentList,
  canActivate: [authGuard],
  data: {
    title: config.title,
    breadcrumb: config.breadcrumb,
    documentType: config.type, // Pasa el tipo de documento al componente
  },
}));

export const legalRoutes: Routes = [
  {
    path: "legal-minutes-pendings", // Ruta anterior: 'pendientes-minutas-legal'
    loadComponent: () =>
      import("@legal.luxuryapp/legal/meeting-minutes/legal-pendientes-minuta").then(
        (m) => m.LegalPendientesMinuta,
      ),
    canActivate: [authGuard],
    data: {
      title: "Pendientes de Minutas Legal",
      breadcrumb: "Pendientes de Minutas Legal",
    },
  },
  {
    path: "list-ticket-legal", // Sincronizado con BD (ya en inglés)
    loadComponent: () =>
      import("@legal.luxuryapp/legal/legal-tickets/ticket-legal-lista").then(
        (m) => m.TicketLegalLista,
      ),
    canActivate: [authGuard],
    data: {
      title: "Listado de Tickets Legales", // Ajustado para mayor especificidad
      breadcrumb: "Listado de Tickets Legales",
    },
  },
  {
    path: "pendings", // Sincronizado con BD (ya en inglés)
    loadComponent: () =>
      import("@legal.luxuryapp/legal/legal-tickets/ticket-legal-reportes-pendientes").then(
        (m) => m.TicketLegalReportesPendientes,
      ),
    canActivate: [authGuard],
    data: {
      title: "Reporte General de Pendientes", // Ajustado a mayúsculas
      breadcrumb: "Reporte General de Pendientes",
    },
  },
  {
    path: "reports-internal",
    loadComponent: () =>
      import("@legal.luxuryapp/legal/legal-tickets/ticket-legal-reportes-internos").then(
        (m) => m.TicketLegalReportesInternos,
      ),
    canActivate: [authGuard],
    data: {
      title: "Reporte Interno", // Ajustado a mayúsculas
      breadcrumb: "Reporte Interno",
    },
  },
  {
    path: "reports-external",
    loadComponent: () =>
      import("@legal.luxuryapp/legal/legal-tickets/ticket-legal-reportes-externos").then(
        (m) => m.TicketLegalReportesExternos,
      ),
    canActivate: [authGuard],
    data: {
      title: "Reporte Externo", // Ajustado a mayúsculas
      breadcrumb: "Reporte Externo",
    },
  },
  {
    path: "committee-directory", // Ruta anterior: 'directorio-comites'
    loadComponent: () =>
      import("@legal.luxuryapp/vigilance-committees/comites-list").then(
        (m) => m.ComitesList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Directorio de Comités", // Corregida mayúscula y acento
      breadcrumb: "Directorio de Comités",
    },
  },
  {
    path: "legal-matter",
    loadComponent: () =>
      import("@legal.luxuryapp/legal/legal-matter/asunto-legal-lista").then(
        (m) => m.AsuntoLegalLista,
      ),
    canActivate: [authGuard],
    data: {
      title: "Catálogo de Asuntos Legales", // Corregido acento
      breadcrumb: "Catálogo de Asuntos Legales",
    },
  },
  //Esta ruta se agregó en la versión 1.0.0 para que accedieran los adminsitradores
  {
    path: "list-ticket-customer",
    loadComponent: () =>
      import("@legal.luxuryapp/legal/legal-tickets/ticket-legal-lista-cliente").then(
        (m) => m.TicketLegalListaCliente,
      ),
    canActivate: [authGuard],
    data: {
      title: "Listado de Tickets del Cliente",
      breadcrumb: "Listado de Tickets del Cliente",
    },
  },
  {
    path: "ticket/:ticketId",
    loadComponent: () =>
      import("@legal.luxuryapp/legal/legal-tickets/ticket-legal-individual").then(
        (m) => m.TicketLegalIndividual,
      ),
    canActivate: [authGuard],
    data: {
      title: "Detalles del Ticket",
      breadcrumb: "Detalles del Ticket",
    },
  },

  // =============================================================
  // CONTRATOS LABORALES
  // =============================================================
  {
    path: "contracts",
    loadComponent: () =>
      import("@legal.luxuryapp/employee-contracts/work-contract/work-contract-list").then(
        (m) => m.WorkContractList,
      ),
    canActivate: [
      () =>
        inject(AspRoleService).hasAny([
          ApplicationRole.SuperUsuario,
          ApplicationRole.RecursosHumanos,
        ]),
    ],
    data: {
      title: "Contratos Laborales",
      breadcrumb: "Contratos Laborales",
    },
  },

  // =============================================================
  // PLANTILLAS DE CONTRATOS
  // =============================================================
  {
    path: "contract-templates",
    loadComponent: () =>
      import("@legal.luxuryapp/employee-contracts/contract-template/contract-template-list").then(
        (m) => m.ContractTemplateList,
      ),
    canActivate: [
      () =>
        inject(AspRoleService).hasAny([
          ApplicationRole.SuperUsuario,
          ApplicationRole.RecursosHumanos,
        ]),
    ],
    data: {
      title: "Machotes de Contratos",
      breadcrumb: "Machotes de Contratos",
    },
  },

  // =============================================================
  // ADENDAS A CONTRATOS
  // =============================================================
  {
    path: "contract-addendums",
    loadComponent: () =>
      import("@legal.luxuryapp/employee-contracts/contract-addendum/contract-addendum-list").then(
        (m) => m.ContractAddendumList,
      ),
    canActivate: [
      () =>
        inject(AspRoleService).hasAny([
          ApplicationRole.SuperUsuario,
          ApplicationRole.RecursosHumanos,
        ]),
    ],
    data: {
      title: "Adendas a Contratos",
      breadcrumb: "Adendas",
    },
  },

  // =============================================================
  // PLANTILLAS DE ADENDAS
  // =============================================================
  {
    path: "addendum-templates",
    loadComponent: () =>
      import("@legal.luxuryapp/employee-contracts/addendum-template/addendum-template-list").then(
        (m) => m.AddendumTemplateList,
      ),
    canActivate: [
      () =>
        inject(AspRoleService).hasAny([
          ApplicationRole.SuperUsuario,
          ApplicationRole.RecursosHumanos,
        ]),
    ],
    data: {
      title: "Machotes de Adendas",
      breadcrumb: "Machotes de Adendas",
    },
  },

  // Rutas para los documentos...
  {
    path: "documents", // Una ruta padre para agrupar todos los documentos
    children: documentRoutes,
  },
];
