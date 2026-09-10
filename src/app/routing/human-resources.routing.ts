import { inject } from "@angular/core";
import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/auth/guards/auth.guard";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
export const humanResourcesRoutes: Routes = [
  // =============================================================
  // DASHBOARD PRINCIPAL DE RH
  // =============================================================
  {
    path: "",
    loadComponent: () =>
      import("src/app/modules/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/dashboard/hr-dashboard").then(
        (m) => m.HRDashboard,
      ),
    canActivate: [
      () =>
        inject(AspRoleService).hasAny([
          ApplicationRole.SuperUsuario,
          ApplicationRole.RecursosHumanos,
          ApplicationRole.Comite,
          ApplicationRole.Administrador,
          ApplicationRole.GerenteOperaciones,
          ApplicationRole.GerenteAtencion,
          ApplicationRole.Asistente,
        ]),
    ],
    data: {
      title: "Recursos Humanos - Dashboard",
      breadcrumb: "Recursos Humanos",
    },
  },

  // =============================================================
  // PERMISOS (LEAVE REQUESTS)
  // =============================================================
  {
    path: "my-requests", // Ruta anterior: 'mis-solicitudes'
    loadComponent: () =>
      import("src/app/modules/recursos-humanos.luxuryapp/time-off/leave-request/mis-permisos-listado").then(
        (m) => m.MisPermisosListado,
      ),
    canActivate: [authGuard],
    data: {
      title: "Mis Solicitudes de Permiso",
      breadcrumb: "Mis Solicitudes de permiso",
    },
  },
  {
    // Suggested path: 'request-leave'
    path: "solicitar-permiso",
    loadComponent: () =>
      import("src/app/modules/recursos-humanos.luxuryapp/time-off/leave-request/permiso-form").then(
        (m) => m.PermisoForm,
      ),
    canActivate: [authGuard],
    data: {
      title: "Solicitar Permiso",
      breadcrumb: "Solicitar Permiso",
    },
  },
  {
    // Suggested path: 'leave/:id/detail'
    path: "permiso/:id/detalle",
    loadComponent: () =>
      import("src/app/modules/recursos-humanos.luxuryapp/time-off/leave-request-approval/permiso-detalle-aprobar").then(
        (m) => m.PermisoDetalleAprobar,
      ),
    canActivate: [authGuard],
    data: {
      title: "Detalle de Permiso",
      breadcrumb: "Detalle de Permiso",
    },
  },

  // =============================================================
  // LISTADO DE APROBACIONES DE PERMISOS Y VACACIONES
  // =============================================================
  {
    path: "approval",
    loadComponent: () =>
      import("src/app/modules/recursos-humanos.luxuryapp/time-off/panel-aprobaciones/panel-aprobaciones").then(
        (m) => m.PanelAprobaciones,
      ),
    canActivate: [authGuard],
    data: {
      title: "Aprobaciones de Permisos",
      breadcrumb: "Aprobaciones",
    },
  },

  // =============================================================
  // VACACIONES (VACATION REQUESTS)
  // =============================================================
  {
    // Suggested path: 'request-vacation'
    path: "solicitar-vacaciones",
    loadComponent: () =>
      import("src/app/modules/recursos-humanos.luxuryapp/time-off/my-vacation-requests/vacaciones-form").then(
        (m) => m.VacacionesForm,
      ),
    canActivate: [authGuard],
    data: {
      title: "Solicitar Vacaciones",
      breadcrumb: "Solicitar Vacaciones",
    },
  },
  {
    path: "my-vacations", // Ruta anterior: 'mis-vacaciones'
    loadComponent: () =>
      import("src/app/modules/recursos-humanos.luxuryapp/time-off/my-vacation-requests/mis-vacaciones-listado").then(
        (m) => m.MisVacacionesListado,
      ),
    canActivate: [authGuard],
    data: {
      title: "Mis Vacaciones",
      breadcrumb: "Mis Vacaciones",
    },
  },
  {
    // Suggested path: 'vacation/:id/detail'
    path: "vacaciones/:id/detalle",
    loadComponent: () =>
      import("src/app/modules/recursos-humanos.luxuryapp/time-off/vacation-request-approval/vacacion-solicitud-detalle").then(
        (m) => m.VacacionSolicitudDetalle,
      ),
    canActivate: [authGuard],
    data: {
      title: "Detalle de Vacaciones",
      breadcrumb: "Detalle de Vacaciones",
    },
  },
  {
    // Suggested path: 'vacation-balance'
    path: "saldo-vacaciones",
    loadComponent: () =>
      import("src/app/modules/recursos-humanos.luxuryapp/time-off/vacation-balance-admin/vacaciones-saldo").then(
        (m) => m.VacacionesSaldo,
      ),
    canActivate: [authGuard],
    data: {
      title: "Saldo de Vacaciones",
      breadcrumb: "Saldo de Vacaciones",
    },
  },

  // =============================================================
  // UTILIDADES / HERRAMIENTAS COMUNES
  // =============================================================
  {
    path: "vacation-calendar", // Ruta anterior: 'calendario-vacaciones'
    loadComponent: () =>
      import("src/app/modules/recursos-humanos.luxuryapp/time-off/calendario-vacaciones-permisos/calendario-vacaciones-permisos").then(
        (m) => m.CalendarioVacacionesPermisos,
      ),
    canActivate: [authGuard],
    data: {
      title: "Calendario de Personal",
      breadcrumb: "Calendario de Personal",
    },
  },
  {
    path: "register-past-vacations", // Ruta anterior: 'registrar-vacaciones-pasadas'
    loadComponent: () =>
      import("src/app/modules/recursos-humanos.luxuryapp/time-off/past-vacations/vacaciones-pasadas-registro").then(
        (m) => m.VacacionesPasadasRegistro,
      ),
    canActivate: [authGuard],
    data: {
      title: "Registrar Vacaciones Pasadas",
      breadcrumb: "Registrar Vacaciones",
    },
  },
  {
    path: "requests-history", // Ruta anterior: 'historial-solicitudes'
    loadComponent: () =>
      import("src/app/modules/recursos-humanos.luxuryapp/time-off/historial-solicitudes/solicitudes-historial").then(
        (m) => m.SolicitudesHistorial,
      ),
    canActivate: [authGuard],
    data: {
      title: "Historial de Solicitudes",
      breadcrumb: "Historial de Solicitudes",
    },
  },

  // =============================================================
  // ADMINISTRACIóN (SOLO SUPERUSUARIO)
  // =============================================================
  {
    path: "admin-balances-vacaciones",
    loadComponent: () =>
      import("src/app/modules/recursos-humanos.luxuryapp/time-off/admin-vacaciones-balance/admin-vacaciones-balance").then(
        (m) => m.AdminVacacionesBalance,
      ),
    canActivate: [
      () => inject(AspRoleService).hasRole(ApplicationRole.SuperUsuario),
    ],
    data: {
      title: "Administración de Balances",
      breadcrumb: "Admin Balances",
    },
  },
  {
    // Vista de auditoróa: ver balance e historial de cualquier empleado del cliente.
    path: "auditoria-vacaciones",
    loadComponent: () =>
      import("src/app/modules/recursos-humanos.luxuryapp/time-off/vacation-balance-admin/vacaciones-admin-auditoria").then(
        (m) => m.VacacionesAdminAuditoria,
      ),
    canActivate: [
      () =>
        inject(AspRoleService).hasAny([
          ApplicationRole.SuperUsuario,
          ApplicationRole.RecursosHumanos,
        ]),
    ],
    data: {
      title: "Auditoróa de Vacaciones",
      breadcrumb: "Auditoróa Vacaciones",
    },
  },

  // =============================================================
  // CHECADOR DE EMPLEADOS
  // =============================================================
  {
    path: "chekador-empleados",
    loadComponent: () =>
      import("src/app/modules/recursos-humanos.luxuryapp/chekador-empleados/chekador-list").then(
        (m) => m.ChekadorList,
      ),
    canActivate: [
      () =>
        inject(AspRoleService).hasAny([
          ApplicationRole.SuperUsuario,
          ApplicationRole.RecursosHumanos,
          ApplicationRole.Administrador,
        ]),
    ],
    data: {
      title: "Checador de Empleados",
      breadcrumb: "Checador",
    },
  },

  // =============================================================
  // NOMINA
  // =============================================================
  {
    path: "nomina",
    loadComponent: () =>
      import("src/app/modules/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/nomina/nomina-dashboard/nomina-dashboard").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Nomina", breadcrumb: "Nomina" },
  },
  {
    path: "nomina/configuracion",
    loadComponent: () =>
      import("src/app/modules/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/nomina/configuracion-nomina/configuracion-nomina").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Configuracion de Nomina", breadcrumb: "Configuracion" },
  },
  {
    path: "nomina/periodos",
    loadComponent: () =>
      import("src/app/modules/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/nomina/periodos-nomina/periodos-nomina").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Periodos de Nomina", breadcrumb: "Periodos" },
  },
  {
    path: "nomina/nominas",
    loadComponent: () =>
      import("src/app/modules/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/nomina/nominas/nominas").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Nominas", breadcrumb: "Nominas" },
  },
  {
    path: "nomina/nominas/:id/detalle",
    loadComponent: () =>
      import("src/app/modules/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/nomina/nomina-detalle/nomina-detalle").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Detalle de Nomina", breadcrumb: "Detalle" },
  },
  {
    path: "nomina/incidencias",
    loadComponent: () =>
      import("src/app/modules/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/nomina/incidencias-nomina/incidencias-nomina").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Incidencias de Nomina", breadcrumb: "Incidencias" },
  },
  {
    path: "nomina/tiempo-extra",
    loadComponent: () =>
      import("src/app/modules/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/nomina/tiempo-extra/tiempo-extra").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Tiempo Extra", breadcrumb: "Tiempo Extra" },
  },
  {
    path: "nomina/prestamos",
    loadComponent: () =>
      import("src/app/modules/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/nomina/prestamos-empleado/prestamos-empleado").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Prestamos a Empleados", breadcrumb: "Prestamos" },
  },
  {
    path: "nomina/evidencias",
    loadComponent: () =>
      import("src/app/modules/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/nomina/evidencias-nomina/evidencias-nomina").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Evidencias de Nomina", breadcrumb: "Evidencias" },
  },
  {
    path: "nomina/hoja-incidencias",
    loadComponent: () =>
      import("src/app/modules/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/nomina/hoja-incidencias/hoja-incidencias").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Hoja de Incidencias", breadcrumb: "Hoja de Incidencias" },
  },
];
