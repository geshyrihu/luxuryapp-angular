import { inject } from "@angular/core";
import { Routes } from "@angular/router";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { authGuard } from "src/app/core/guard/auth.guard";
import { AspRoleService } from "src/app/core/services/asp-role.service";
export const humanResourcesRoutes: Routes = [
  // =============================================================
  // DASHBOARD PRINCIPAL DE RH
  // =============================================================
  {
    path: "",
    loadComponent: () =>
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/dashboard/hr-dashboard").then(
        (m) => m.HRDashboard,
      ),
    canActivate: [
      () =>
        inject(AspRoleService).hasAny([
          EApplicationRole.SuperUsuario,
          EApplicationRole.RecursosHumanos,
          EApplicationRole.Comite,
          EApplicationRole.Administrador,
          EApplicationRole.GerenteOperaciones,
          EApplicationRole.GerenteAtencion,
          EApplicationRole.Asistente,
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
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/leave-request/mis-permisos-listado").then(
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
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/leave-request/permiso-form").then(
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
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/leave-request-approval/permiso-detalle-aprobar").then(
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
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/panel-aprobaciones/panel-aprobaciones").then(
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
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/my-vacation-requests/vacaciones-form").then(
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
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/my-vacation-requests/mis-vacaciones-listado").then(
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
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/vacation-request-approval/vacacion-solicitud-detalle").then(
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
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/vacation-balance-admin/vacaciones-saldo").then(
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
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/calendario-vacaciones-permisos/calendario-vacaciones-permisos").then(
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
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/past-vacations/vacaciones-pasadas-registro").then(
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
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/historial-solicitudes/solicitudes-historial").then(
        (m) => m.SolicitudesHistorial,
      ),
    canActivate: [authGuard],
    data: {
      title: "Historial de Solicitudes",
      breadcrumb: "Historial de Solicitudes",
    },
  },

  // =============================================================
  // ADMINISTRACIÓN (SOLO SUPERUSUARIO)
  // =============================================================
  {
    path: "admin-balances-vacaciones",
    loadComponent: () =>
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/admin-vacaciones-balance/admin-vacaciones-balance").then(
        (m) => m.AdminVacacionesBalance,
      ),
    canActivate: [
      () => inject(AspRoleService).hasRole(EApplicationRole.SuperUsuario),
    ],
    data: {
      title: "Administración de Balances",
      breadcrumb: "Admin Balances",
    },
  },
  {
    // Vista de auditoría: ver balance e historial de cualquier empleado del cliente.
    path: "auditoria-vacaciones",
    loadComponent: () =>
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/vacation-balance-admin/vacaciones-admin-auditoria").then(
        (m) => m.VacacionesAdminAuditoria,
      ),
    canActivate: [
      () =>
        inject(AspRoleService).hasAny([
          EApplicationRole.SuperUsuario,
          EApplicationRole.RecursosHumanos,
        ]),
    ],
    data: {
      title: "Auditoría de Vacaciones",
      breadcrumb: "Auditoría Vacaciones",
    },
  },

  // =============================================================
  // CONTRATOS LABORALES
  // =============================================================
  {
    path: "contracts",
    loadComponent: () =>
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/work-contract/pages/work-contract-list").then(
        (m) => m.WorkContractList,
      ),
    canActivate: [
      () =>
        inject(AspRoleService).hasAny([
          EApplicationRole.SuperUsuario,
          EApplicationRole.RecursosHumanos,
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
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/contract-template/pages/contract-template-list").then(
        (m) => m.ContractTemplateList,
      ),
    canActivate: [
      () =>
        inject(AspRoleService).hasAny([
          EApplicationRole.SuperUsuario,
          EApplicationRole.RecursosHumanos,
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
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/contract-addendum/pages/contract-addendum-list").then(
        (m) => m.ContractAddendumList,
      ),
    canActivate: [
      () =>
        inject(AspRoleService).hasAny([
          EApplicationRole.SuperUsuario,
          EApplicationRole.RecursosHumanos,
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
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/addendum-template/pages/addendum-template-list").then(
        (m) => m.AddendumTemplateList,
      ),
    canActivate: [
      () =>
        inject(AspRoleService).hasAny([
          EApplicationRole.SuperUsuario,
          EApplicationRole.RecursosHumanos,
        ]),
    ],
    data: {
      title: "Machotes de Adendas",
      breadcrumb: "Machotes de Adendas",
    },
  },

  // =============================================================
  // INCIDENCIAS DISCIPLINARIAS
  // =============================================================
  {
    path: "incidents",
    loadComponent: () =>
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/incidencias-sanciones/incident/pages/incident-list").then(
        (m) => m.IncidentList,
      ),
    canActivate: [
      () =>
        inject(AspRoleService).hasAny([
          EApplicationRole.SuperUsuario,
          EApplicationRole.RecursosHumanos,
        ]),
    ],
    data: {
      title: "Incidencias Disciplinarias",
      breadcrumb: "Incidencias",
    },
  },
  {
    path: "incident-dashboard",
    loadComponent: () =>
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/incidencias-sanciones/incident/pages/incident-dashboard/incident-dashboard").then(
        (m) => m.IncidentDashboardComponent,
      ),
    canActivate: [
      () =>
        inject(AspRoleService).hasAny([
          EApplicationRole.SuperUsuario,
          EApplicationRole.RecursosHumanos,
          EApplicationRole.Direccion,
        ]),
    ],
    data: {
      title: "Dashboard de Incidencias",
      breadcrumb: "Dashboard",
    },
  },

  // =============================================================
  // REPORTES DE INCIDENCIAS
  // =============================================================
  {
    path: "incident-reports",
    loadComponent: () =>
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/incidencias-sanciones/incident-report/pages/incident-report").then(
        (m) => m.IncidentReport,
      ),
    canActivate: [
      () =>
        inject(AspRoleService).hasAny([
          EApplicationRole.SuperUsuario,
          EApplicationRole.RecursosHumanos,
        ]),
    ],
    data: {
      title: "Reportes de Incidencias",
      breadcrumb: "Reportes de Incidencias",
    },
  },

  // =============================================================
  // EXPEDIENTE DEL EMPLEADO
  // =============================================================
  {
    path: "employee-files",
    loadComponent: () =>
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/employee-file/pages/employee-file-list").then(
        (m) => m.EmployeeFileList,
      ),
    canActivate: [
      () =>
        inject(AspRoleService).hasAny([
          EApplicationRole.SuperUsuario,
          EApplicationRole.RecursosHumanos,
        ]),
    ],
    data: {
      title: "Expediente del Empleado",
      breadcrumb: "Expedientes",
    },
  },
  {
    path: "employee-files/:employeeId",
    loadComponent: () =>
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/employee-file/pages/employee-file-detail").then(
        (m) => m.EmployeeFileDetail,
      ),
    canActivate: [
      () =>
        inject(AspRoleService).hasAny([
          EApplicationRole.SuperUsuario,
          EApplicationRole.RecursosHumanos,
        ]),
    ],
    data: {
      title: "Expediente del Empleado",
      breadcrumb: "Detalle de Expediente",
    },
  },

  // =============================================================
  // SANCIONES
  // =============================================================
  {
    path: "sanctions",
    loadComponent: () =>
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/incidencias-sanciones/sanction/pages/sanction-list").then(
        (m) => m.SanctionList,
      ),
    canActivate: [
      () =>
        inject(AspRoleService).hasAny([
          EApplicationRole.SuperUsuario,
          EApplicationRole.RecursosHumanos,
        ]),
    ],
    data: {
      title: "Sanciones",
      breadcrumb: "Sanciones",
    },
  },

  // =============================================================
  // DATOS BANCARIOS DE EMPLEADOS
  // =============================================================
  {
    path: "bank-data",
    loadComponent: () =>
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/employee-bank-data/pages/employee-bank-data-list").then(
        (m) => m.EmployeeBankDataList,
      ),
    canActivate: [
      () =>
        inject(AspRoleService).hasAny([
          EApplicationRole.SuperUsuario,
          EApplicationRole.RecursosHumanos,
        ]),
    ],
    data: {
      title: "Datos Bancarios de Empleados",
      breadcrumb: "Datos Bancarios",
    },
  },

  // =============================================================
  // NOMINA
  // =============================================================
  {
    path: "nomina",
    loadComponent: () =>
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/nomina/nomina-dashboard/nomina-dashboard").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Nomina", breadcrumb: "Nomina" },
  },
  {
    path: "nomina/configuracion",
    loadComponent: () =>
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/nomina/pages/configuracion-nomina/configuracion-nomina").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Configuracion de Nomina", breadcrumb: "Configuracion" },
  },
  {
    path: "nomina/periodos",
    loadComponent: () =>
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/nomina/pages/periodos-nomina/periodos-nomina").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Periodos de Nomina", breadcrumb: "Periodos" },
  },
  {
    path: "nomina/nominas",
    loadComponent: () =>
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/nomina/pages/nominas/nominas").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Nominas", breadcrumb: "Nominas" },
  },
  {
    path: "nomina/nominas/:id/detalle",
    loadComponent: () =>
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/nomina/pages/nomina-detalle/nomina-detalle").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Detalle de Nomina", breadcrumb: "Detalle" },
  },
  {
    path: "nomina/incidencias",
    loadComponent: () =>
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/nomina/pages/incidencias-nomina/incidencias-nomina").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Incidencias de Nomina", breadcrumb: "Incidencias" },
  },
  {
    path: "nomina/tiempo-extra",
    loadComponent: () =>
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/nomina/pages/tiempo-extra/tiempo-extra").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Tiempo Extra", breadcrumb: "Tiempo Extra" },
  },
  {
    path: "nomina/prestamos",
    loadComponent: () =>
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/nomina/pages/prestamos-empleado/prestamos-empleado").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Prestamos a Empleados", breadcrumb: "Prestamos" },
  },
  {
    path: "nomina/evidencias",
    loadComponent: () =>
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/nomina/pages/evidencias-nomina/evidencias-nomina").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Evidencias de Nomina", breadcrumb: "Evidencias" },
  },
  {
    path: "nomina/hoja-incidencias",
    loadComponent: () =>
      import("src/app/features/hr/expediente-del-empleado/recursos-humanos/nomina/pages/hoja-incidencias/hoja-incidencias").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Hoja de Incidencias", breadcrumb: "Hoja de Incidencias" },
  },
  {
    path: "incident-types",
    loadComponent: () =>
      import("src/app/features/hr/evaluaciones-de-desempeo/hr-catalog/pages/incident-type-list").then(
        (m) => m.IncidentTypeList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Tipos de Incidencia",
      breadcrumb: "Tipos de Incidencia",
    },
  },
  {
    path: "sanction-types",
    loadComponent: () =>
      import("src/app/features/hr/evaluaciones-de-desempeo/hr-catalog/pages/sanction-type-list").then(
        (m) => m.SanctionTypeList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Tipos de Sanción",
      breadcrumb: "Tipos de Sanción",
    },
  },
];

