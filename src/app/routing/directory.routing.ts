import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/auth/guards/auth.guard";
export const directoryRoutes: Routes = [
  {
    path: "provider", // Ruta anterior: 'proveedor'
    loadComponent: () =>
      import("src/app/apps/supplier.luxuryapp/providers/provider/provider-list").then(
        (m) => m.ListProvider,
      ),
    canActivate: [authGuard],
    data: {
      title: "Proveedor",
      breadcrumb: "Proveedor",
    },
  },
  {
    path: "condos", // Ruta anterior: 'condominos'
    loadComponent: () =>
      import("src/app/apps/resident.luxuryapp/owner/owner-list").then(
        (m) => m.OwnerList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Condominos",
      breadcrumb: "Condominos",
    },
  },
  {
    path: "properties", // Ruta anterior: 'propiedades'
    loadComponent: () =>
      import("src/app/apps/resident.luxuryapp/property/propiedades-list").then(
        (m) => m.PropiedadesList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Propiedades",
      breadcrumb: "Propiedades",
    },
  },
  {
    path: "vigilance-committee", // Ruta anterior: 'comite-vigilancia'
    loadComponent: () =>
      import("src/app/apps/legal.luxuryapp/comite-vigilancia/comite-vigilancia-list").then(
        (m) => m.ComiteVigilanciaList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Comité de Vigilancia",
      breadcrumb: "Comité de Vigilancia",
    },
  },
  {
    path: "staff",
    loadComponent: () =>
      import("src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/employees/staff-board/staff-board").then(
        (m) => m.StaffBoard,
      ),
    canActivate: [authGuard],
    data: {
      title: "Plantilla y Personal",
      breadcrumb: "Plantilla y Personal",
    },
  },
  {
    path: "work-position-org-chart",
    loadComponent: () =>
      import("src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/employees/org-chart/org-chart").then(
        (m) => m.OrgChart,
      ),
    canActivate: [authGuard],
    data: {
      title: "Organigrama de Puestos",
      breadcrumb: "Organigrama de Puestos",
    },
  },
  {
    path: "internal-staff", // Ruta anterior: 'personal-interno'
    loadComponent: () =>
      import("src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/employees/employees/employee-list").then(
        (m) => m.EmployeeList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Personal Interno",
      breadcrumb: "Personal Interno",
    },
  },
  {
    path: "employee-interviewer-queue",
    loadComponent: () =>
      import("src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/employees/employee-interviewer-queue/employee-interviewer-queue").then(
        (m) => m.EmployeeInterviewerQueue,
      ),
    canActivate: [authGuard],
    data: {
      title: "Mis Vacantes y Entrevistas",
      breadcrumb: "Vacantes y Entrevistas",
    },
  },
  {
    path: "employee-interviews/respond",
    loadComponent: () =>
      import("src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/employees/employee-interviewer-queue/employee-interview-response").then(
        (m) => m.EmployeeInterviewResponse,
      ),
    canActivate: [authGuard],
    data: {
      title: "Responder Entrevista",
      breadcrumb: "Responder Entrevista",
    },
  },
  {
    path: "external-staff", // Ruta anterior: 'personal-externo'
    loadComponent: () =>
      import("src/app/apps/recursos-humanos.luxuryapp/employee-external/employee-external-list").then(
        (m) => m.EmployeeExternalList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Personal Externo",
      breadcrumb: "Personal Externo",
    },
  },
  {
    // Suggested path: 'employee/:employeeId/:applicationUserId'
    path: "empleado/:employeeId/:applicationUserId",
    loadComponent: () =>
      import("src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/employees/staff-board/employee-form").then(
        (m) => m.EmployeeForm,
      ),
    canActivate: [authGuard],
    data: {
      title: "Empleado",
      breadcrumb: "Empleado",
    },
  },
  {
    path: "emergency-phones", // Ruta anterior: 'telefonos-emergencia'
    loadComponent: () =>
      import("src/app/apps/public.luxuryapp/telefonos-emergencia/telefonos-emergencia").then(
        (m) => m.TelefonosEmergencia,
      ),
    canActivate: [authGuard],
    data: {
      title: "Teléfonos de Emergencia",
      breadcrumb: "Teléfonos de Emergencia",
    },
  },
  {
    // Suggested path: 'my-providers'
    path: "mis-proveedores",
    loadComponent: () =>
      import("src/app/apps/admin.luxuryapp/reportes/customer-provider/mis-proveedores-list").then(
        (m) => m.MisProveedores,
      ),
    canActivate: [authGuard],
    data: {
      title: "Mis Proveedores",
      breadcrumb: "Mis Proveedores",
    },
  },
];
