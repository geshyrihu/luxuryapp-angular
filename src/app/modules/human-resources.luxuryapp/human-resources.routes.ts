import { inject } from "@angular/core";
import { Routes } from "@angular/router";
import { authGuard } from "@core/auth/guards/auth.guard";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";

export const humanResourcesRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("@human-resources.luxuryapp/shared/dashboard/hr-dashboard").then(
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
  {
    path: "my-requests",
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
    path: "request-leave",
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
    path: "leave/:id/detail",
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
  {
    path: "request-vacation",
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
    path: "my-vacations",
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
    path: "vacation/:id/detail",
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
    path: "vacation-balance",
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
  {
    path: "vacation-calendar",
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
    path: "register-past-vacations",
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
    path: "requests-history",
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
  {
    path: "admin-vacation-balances",
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
    path: "vacation-audit",
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
      title: "Auditoría de Vacaciones",
      breadcrumb: "Auditoría Vacaciones",
    },
  },
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
  {
    path: "salary-projections-risk-premium",
    loadComponent: () =>
      import("@human-resources.luxuryapp/salary-projections/risk-premium-list/risk-premium-list").then(
        (m) => m.RiskPremiumList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Prima de Riesgo por Cliente",
      breadcrumb: "Prima de Riesgo",
    },
  },
  {
    path: "employee-time-clock",
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
  {
    path: "payroll",
    loadComponent: () =>
      import("@human-resources.luxuryapp/payroll/dashboard/nomina-dashboard").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Nomina", breadcrumb: "Nomina" },
  },
  {
    path: "payroll/configuration",
    loadComponent: () =>
      import("@human-resources.luxuryapp/payroll/configuration/configuracion-nomina").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Configuracion de Nomina", breadcrumb: "Configuracion" },
  },
  {
    path: "payroll/periods",
    loadComponent: () =>
      import("@human-resources.luxuryapp/payroll/periods/periodos-nomina").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Periodos de Nomina", breadcrumb: "Periodos" },
  },
  {
    path: "payroll/headers",
    loadComponent: () =>
      import("@human-resources.luxuryapp/payroll/headers/nominas").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Nominas", breadcrumb: "Nominas" },
  },
  {
    path: "payroll/headers/:id/detail",
    loadComponent: () =>
      import("@human-resources.luxuryapp/payroll/details/nomina-detalle").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Detalle de Nomina", breadcrumb: "Detalle" },
  },
  {
    path: "payroll/incidents",
    loadComponent: () =>
      import("@human-resources.luxuryapp/payroll/incidents/incidencias-nomina").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Incidencias de Nomina", breadcrumb: "Incidencias" },
  },
  {
    path: "payroll/overtime",
    loadComponent: () =>
      import("@human-resources.luxuryapp/payroll/overtime/tiempo-extra").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Tiempo Extra", breadcrumb: "Tiempo Extra" },
  },
  {
    path: "payroll/loans",
    loadComponent: () =>
      import("@human-resources.luxuryapp/payroll/loans/prestamos-empleado").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Prestamos a Empleados", breadcrumb: "Prestamos" },
  },
  {
    path: "payroll/evidence",
    loadComponent: () =>
      import("@human-resources.luxuryapp/payroll/evidence/evidencias-nomina").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Evidencias de Nomina", breadcrumb: "Evidencias" },
  },
  {
    path: "payroll/incident-sheet",
    loadComponent: () =>
      import("@human-resources.luxuryapp/payroll/incident-sheet/hoja-incidencias").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Hoja de Incidencias", breadcrumb: "Hoja de Incidencias" },
  },
  {
    path: "evaluation/templates/list",
    loadComponent: () =>
      import("@human-resources.luxuryapp/evaluation/evaluation-template/lista-plantilla-evaluacion").then(
        (m) => m.ListaPlantillaEvaluacion,
      ),
    canActivate: [authGuard],
    data: {
      title: "Plantillas de Evaluación",
      breadcrumb: "Plantillas de Evaluación",
    },
  },
  {
    path: "evaluation/templates/create",
    loadComponent: () =>
      import("@human-resources.luxuryapp/evaluation/evaluation-template/formulario-plantilla-evaluacion").then(
        (m) => m.FormularioPlantillaEvaluacion,
      ),
    canActivate: [authGuard],
    data: {
      title: "Crear plantilla de evaluación",
      breadcrumb: "Crear plantilla de evaluación",
    },
  },
  {
    path: "evaluation/templates/edit/:id",
    loadComponent: () =>
      import("@human-resources.luxuryapp/evaluation/evaluation-template/formulario-plantilla-evaluacion").then(
        (m) => m.FormularioPlantillaEvaluacion,
      ),
    canActivate: [authGuard],
    data: {
      title: "Editar plantilla de evaluación",
      breadcrumb: "Editar plantilla de evaluación",
    },
  },
  {
    path: "evaluation/conduct/create",
    loadComponent: () =>
      import("@human-resources.luxuryapp/evaluation/evaluation-template/performance-evaluation/realizar-evaluacion").then(
        (m) => m.RealizarEvaluacion,
      ),
    canActivate: [authGuard],
    data: {
      title: "Realizar Evaluación",
      breadcrumb: "Realizar Evaluación",
    },
  },
  {
    path: "evaluation/conduct/edit/:id",
    loadComponent: () =>
      import("@human-resources.luxuryapp/evaluation/evaluation-template/performance-evaluation/realizar-evaluacion").then(
        (m) => m.RealizarEvaluacion,
      ),
    canActivate: [authGuard],
    data: {
      title: "Editar Evaluación",
      breadcrumb: "Editar Evaluación",
    },
  },
  {
    path: "evaluation/conduct/list",
    loadComponent: () =>
      import("@human-resources.luxuryapp/evaluation/evaluation-template/performance-evaluation/lista-evaluacion-realizada").then(
        (m) => m.ListaEvaluacionRealizada,
      ),
    canActivate: [authGuard],
    data: {
      title: "Lista de Evaluaciones",
      breadcrumb: "Lista de Evaluaciones",
    },
  },
  {
    path: "evaluation/employee/:employeeId/history",
    loadComponent: () =>
      import("@human-resources.luxuryapp/evaluation/evaluation-template/performance-evaluation/historial-evaluacion").then(
        (m) => m.HistorialEvaluacion,
      ),
    canActivate: [authGuard],
    data: {
      title: "Historial de Evaluaciones",
      breadcrumb: "Historial de Evaluaciones",
    },
  },
  {
    path: "evaluation/result/:id",
    loadComponent: () =>
      import("@human-resources.luxuryapp/evaluation/evaluation-template/performance-evaluation/resultado-evaluacion").then(
        (m) => m.ResultadoEvaluacion,
      ),
    canActivate: [authGuard],
    data: {
      title: "Resultado de Evaluación",
      breadcrumb: "Resultado de Evaluación",
    },
  },
];
