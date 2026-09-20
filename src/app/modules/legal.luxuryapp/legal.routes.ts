import { inject } from "@angular/core";
import { Routes } from "@angular/router";
import { authGuard } from "@core/auth/guards/auth.guard";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { documentTypeRoutesConfig } from "@legal.luxuryapp/legal/interfaces/documentTypeRoutesConfig";

const CustomDocumentList = () =>
  import("@legal.luxuryapp/legal/custom-documents/documento-personalizado-lista").then(
    (m) => m.DocumentoPersonalizadoLista,
  );

const documentRoutes: Routes = documentTypeRoutesConfig.map((config) => ({
  path: config.routeParam,
  loadComponent: CustomDocumentList,
  canActivate: [authGuard],
  data: {
    title: config.title,
    breadcrumb: config.breadcrumb,
    documentType: config.type,
  },
}));

const hrOnlyGuard = () =>
  inject(AspRoleService).hasAny([
    ApplicationRole.SuperUsuario,
    ApplicationRole.RecursosHumanos,
  ]);

export const legalRoutes: Routes = [
  {
    path: "legal-minutes-pendings",
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
    path: "legal-tickets",
    loadComponent: () =>
      import("@legal.luxuryapp/legal/legal-tickets/ticket-legal-lista").then(
        (m) => m.TicketLegalLista,
      ),
    canActivate: [authGuard],
    data: {
      title: "Listado de Tickets Legales",
      breadcrumb: "Listado de Tickets Legales",
    },
  },
  {
    path: "pendings",
    loadComponent: () =>
      import("@legal.luxuryapp/legal/legal-tickets/ticket-legal-reportes-pendientes").then(
        (m) => m.TicketLegalReportesPendientes,
      ),
    canActivate: [authGuard],
    data: {
      title: "Reporte General de Pendientes",
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
      title: "Reporte Interno",
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
      title: "Reporte Externo",
      breadcrumb: "Reporte Externo",
    },
  },
  {
    path: "committee-directory",
    loadComponent: () =>
      import("@legal.luxuryapp/vigilance-committees/comites-list").then(
        (m) => m.ComitesList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Directorio de Comités",
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
      title: "Catálogo de Asuntos Legales",
      breadcrumb: "Catálogo de Asuntos Legales",
    },
  },
  {
    path: "customer-legal-tickets",
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
    path: "legal-ticket/:ticketId",
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
  {
    path: "contracts",
    loadComponent: () =>
      import("@legal.luxuryapp/employee-contracts/work-contract/work-contract-list").then(
        (m) => m.WorkContractList,
      ),
    canActivate: [hrOnlyGuard],
    data: {
      title: "Contratos Laborales",
      breadcrumb: "Contratos Laborales",
    },
  },
  {
    path: "contract-templates",
    loadComponent: () =>
      import("@legal.luxuryapp/employee-contracts/contract-template/contract-template-list").then(
        (m) => m.ContractTemplateList,
      ),
    canActivate: [hrOnlyGuard],
    data: {
      title: "Machotes de Contratos",
      breadcrumb: "Machotes de Contratos",
    },
  },
  {
    path: "contract-addendums",
    loadComponent: () =>
      import("@legal.luxuryapp/employee-contracts/contract-addendum/contract-addendum-list").then(
        (m) => m.ContractAddendumList,
      ),
    canActivate: [hrOnlyGuard],
    data: {
      title: "Adendas a Contratos",
      breadcrumb: "Adendas",
    },
  },
  {
    path: "addendum-templates",
    loadComponent: () =>
      import("@legal.luxuryapp/employee-contracts/addendum-template/addendum-template-list").then(
        (m) => m.AddendumTemplateList,
      ),
    canActivate: [hrOnlyGuard],
    data: {
      title: "Machotes de Adendas",
      breadcrumb: "Machotes de Adendas",
    },
  },
  {
    path: "documents",
    children: documentRoutes,
  },
];
