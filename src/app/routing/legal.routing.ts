import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/guard/auth.guard";
import { documentTypeRoutesConfig } from "../features/tenant/legal/models/documentTypeRoutesConfig";
// Importa el componente de forma perezosa
const CustomDocumentList = () =>
  import("src/app/features/tenant/legal/documento-personalizado/documento-personalizado-lista").then(
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
      import("src/app/features/tenant/legal/minutas/legal-pendientes-minuta").then(
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
      import("src/app/features/tenant/legal/ticket-legal/ticket-legal-lista").then(
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
      import("src/app/features/tenant/legal/ticket-legal/ticket-legal-reportes-pendientes").then(
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
      import("src/app/features/tenant/legal/ticket-legal/ticket-legal-reportes-internos").then(
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
      import("src/app/features/tenant/legal/ticket-legal/ticket-legal-reportes-externos").then(
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
      import("src/app/features/tenant/directorios/comite-vigilancia/comites-list").then(
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
      import("src/app/features/tenant/legal/asunto-legal/asunto-legal-lista").then(
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
      import("src/app/features/tenant/legal/ticket-legal/ticket-legal-lista-cliente").then(
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
      import("src/app/features/tenant/legal/ticket-legal/ticket-legal-individual").then(
        (m) => m.TicketLegalIndividual,
      ),
    canActivate: [authGuard],
    data: {
      title: "Detalles del Ticket",
      breadcrumb: "Detalles del Ticket",
    },
  },

  // Rutas para los documentos...
  {
    path: "documents", // Una ruta padre para agrupar todos los documentos
    children: documentRoutes,
  },
];












