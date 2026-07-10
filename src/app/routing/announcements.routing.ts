import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/auth/guards/auth.guard";
export const announcementsRoutes: Routes = [
  {
    // Suggested path: 'manage'
    path: "manage",
    loadComponent: () =>
      import("src/app/features/operations/announcements/announcement/announcement-admin-list").then(
        (m) => m.AnnouncementAdminList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Administrar anuncios",
      breadcrumb: "Administrar anuncios",
    },
  },

  {
    // Suggested path: 'list'
    path: "list",
    loadComponent: () =>
      import("src/app/features/operations/announcements/announcement/announcement-list").then(
        (m) => m.AnnouncementList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Listado de anuncios",
      breadcrumb: "Listado de anuncios",
    },
  },
  {
    // Suggested path: 'detail/:id'
    path: "detail/:id",
    loadComponent: () =>
      import("src/app/features/operations/announcements/announcement/announcement-detail").then(
        (m) => m.announcementDetail,
      ),
    canActivate: [authGuard],
    data: {
      title: "Detalle",
      breadcrumb: "Detalle",
    },
  },
  {
    // Suggested path: 'detail/:id'
    path: "analytics/:id",
    loadComponent: () =>
      import("src/app/features/operations/announcements/announcement/announcement-analytics").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: {
      title: "Análisis de vistas",
      breadcrumb: "Análisis de vistas",
    },
  },
];
