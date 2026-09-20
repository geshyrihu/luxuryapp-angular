import { inject } from "@angular/core";
import { Routes } from "@angular/router";
import { authGuard } from "@core/auth/guards/auth.guard";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
export const humanResourcesRoutes: Routes = [
  // =============================================================
  // DASHBOARD PRINCIPAL DE RH
  // =============================================================
  {
    path: "",
    loadComponent: () =>
      import("@human-resources.luxuryapp/employee-file/human-resources/dashboard/hr-dashboard").then(
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
      import("@human-resources.luxuryapp/time-off/leave-request/mis-permisos-listado").then(
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
      import("@human-resources.luxuryapp/time-off/leave-request/permiso-form").then(
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
      import("@human-resources.luxuryapp/time-off/leave-request-approval/permiso-detalle-aprobar").then(
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
      import("@human-resources.luxuryapp/time-off/approval-panel/panel-aprobaciones").then(
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
      import("@human-resources.luxuryapp/time-off/my-vacation-requests/vacaciones-form").then(
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
      import("@human-resources.luxuryapp/time-off/my-vacation-requests/mis-vacaciones-listado").then(
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
      import("@human-resources.luxuryapp/time-off/vacation-request-approval/vacacion-solicitud-detalle").then(
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
      import("@human-resources.luxuryapp/time-off/vacation-balance-admin/vacaciones-saldo").then(
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
      import("@human-resources.luxuryapp/time-off/leave-calendar/calendario-vacaciones-permisos").then(
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
      import("@human-resources.luxuryapp/time-off/past-vacations/vacaciones-pasadas-registro").then(
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
      import("@human-resources.luxuryapp/time-off/request-history/solicitudes-historial").then(
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
      import("@human-resources.luxuryapp/time-off/admin-vacaciones-balance/admin-vacaciones-balance").then(
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
      import("@human-resources.luxuryapp/time-off/vacation-balance-admin/vacaciones-admin-auditoria").then(
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
  // PROYECCIÓN DE SUELDOS
  // =============================================================
  {
    path: "salary-projections",
    loadComponent: () =>
      import("@human-resources.luxuryapp/salary-projections/master-dashboard/master-dashboard").then(
        (m) => m.SalaryProjectionsMasterDashboard,
      ),
    canActivate: [authGuard],
    data: {
      title: "Proyección de Sueldos",
      breadcrumb: "Proyección de Sueldos",
    },
  },
  {
    path: "salary-projections/proposals",
    loadComponent: () =>
      import("@human-resources.luxuryapp/salary-projections/salary-projections-list/salary-projections-list").then(
        (m) => m.SalaryProjectionsList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Propuestas Salariales",
      breadcrumb: "Propuestas",
    },
  },
  {
    path: "salary-projections/federal-vacation-parameters",
    loadComponent: () =>
      import("@human-resources.luxuryapp/salary-projections/federal-vacation-parameters/federal-vacation-parameters").then(
        (m) => m.FederalVacationParameters,
      ),
    canActivate: [authGuard],
    data: {
      title: "Vacaciones Federales",
      breadcrumb: "Vacaciones Federales",
    },
  },
  {
    path: "salary-projections/state-tax-parameters",
    loadComponent: () =>
      import("@human-resources.luxuryapp/salary-projections/state-tax-parameters/state-tax-parameters").then(
        (m) => m.StateTaxParameters,
      ),
    canActivate: [authGuard],
    data: {
      title: "ISN Patronal por Estado",
      breadcrumb: "ISN por Estado",
    },
  },
  {
    path: "salary-projections/federal-labor-law-parameters",
    loadComponent: () =>
      import("@human-resources.luxuryapp/salary-projections/federal-labor-law-parameters/federal-labor-law-parameters").then(
        (m) => m.FederalLaborLawParameters,
      ),
    canActivate: [authGuard],
    data: {
      title: "Parámetros LFT",
      breadcrumb: "Parámetros LFT",
    },
  },
  {
    path: "salary-projections/payroll-parameters",
    loadComponent: () =>
      import("@human-resources.luxuryapp/salary-projections/payroll-parameter-config/payroll-parameter-config").then(
        (m) => m.PayrollParameterConfig,
      ),
    canActivate: [authGuard],
    data: {
      title: "Parámetros de Proyección",
      breadcrumb: "Parámetros",
    },
  },
  {
    path: "salary-projections/:id",
    loadComponent: () =>
      import("@human-resources.luxuryapp/salary-projections/salary-projections-detail/salary-projections-detail").then(
        (m) => m.SalaryProjectionsDetail,
      ),
    canActivate: [authGuard],
    data: {
      title: "Detalle de Proyección",
      breadcrumb: "Detalle",
    },
  },

  // =============================================================
  // CHECADOR DE EMPLEADOS
  // =============================================================
  {
    path: "chekador-empleados",
    loadComponent: () =>
      import("@human-resources.luxuryapp/employee-time-clock/chekador-list").then(
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
      import("@human-resources.luxuryapp/payroll/dashboard/nomina-dashboard").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Nomina", breadcrumb: "Nomina" },
  },
  {
    path: "nomina/configuracion",
    loadComponent: () =>
      import("@human-resources.luxuryapp/payroll/configuration/configuracion-nomina").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Configuracion de Nomina", breadcrumb: "Configuracion" },
  },
  {
    path: "nomina/periodos",
    loadComponent: () =>
      import("@human-resources.luxuryapp/payroll/periods/periodos-nomina").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Periodos de Nomina", breadcrumb: "Periodos" },
  },
  {
    path: "nomina/nominas",
    loadComponent: () =>
      import("@human-resources.luxuryapp/payroll/headers/nominas").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Nominas", breadcrumb: "Nominas" },
  },
  {
    path: "nomina/nominas/:id/detalle",
    loadComponent: () =>
      import("@human-resources.luxuryapp/payroll/details/nomina-detalle").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Detalle de Nomina", breadcrumb: "Detalle" },
  },
  {
    path: "nomina/incidencias",
    loadComponent: () =>
      import("@human-resources.luxuryapp/payroll/incidents/incidencias-nomina").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Incidencias de Nomina", breadcrumb: "Incidencias" },
  },
  {
    path: "nomina/tiempo-extra",
    loadComponent: () =>
      import("@human-resources.luxuryapp/payroll/overtime/tiempo-extra").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Tiempo Extra", breadcrumb: "Tiempo Extra" },
  },
  {
    path: "nomina/prestamos",
    loadComponent: () =>
      import("@human-resources.luxuryapp/payroll/loans/prestamos-empleado").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Prestamos a Empleados", breadcrumb: "Prestamos" },
  },
  {
    path: "nomina/evidencias",
    loadComponent: () =>
      import("@human-resources.luxuryapp/payroll/evidence/evidencias-nomina").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Evidencias de Nomina", breadcrumb: "Evidencias" },
  },
  {
    path: "nomina/hoja-incidencias",
    loadComponent: () =>
      import("@human-resources.luxuryapp/payroll/incident-sheet/hoja-incidencias").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Hoja de Incidencias", breadcrumb: "Hoja de Incidencias" },
  },
];
