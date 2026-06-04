import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/guard/auth.guard";
export const directoryRoutes: Routes = [
  {
    path: "provider", // Ruta anterior: 'proveedor'
    loadComponent: () =>
      import("src/app/features/provider/provider-list").then(
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
      import("src/app/features/owner/owner-list").then((m) => m.OwnerList),
    canActivate: [authGuard],
    data: {
      title: "Condominos",
      breadcrumb: "Condominos",
    },
  },
  {
    path: "properties", // Ruta anterior: 'propiedades'
    loadComponent: () =>
      import("src/app/features/property/propiedades-list").then(
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
      import("src/app/features/directorios/comite-vigilancia/comite-vigilancia-list").then(
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
      import("src/app/features/employees/staff-board/staff-board").then(
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
      import("src/app/features/employees/org-chart/org-chart").then(
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
      import("src/app/features/employees/employees/pages/employee-list").then(
        (m) => m.EmployeeList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Personal Interno",
      breadcrumb: "Personal Interno",
    },
  },
  {
    path: "external-staff", // Ruta anterior: 'personal-externo'
    loadComponent: () =>
      import("src/app/features/directorios/employee-external/employee-external-list").then(
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
      import("src/app/features/employees/staff-board/employee-form").then(
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
      import("src/app/features/directorios/telefonos-emergencia/telefonos-emergencia").then(
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
      import("src/app/features/customer-provider/mis-proveedores-list").then(
        (m) => m.MisProveedores,
      ),
    canActivate: [authGuard],
    data: {
      title: "Mis Proveedores",
      breadcrumb: "Mis Proveedores",
    },
  },
];
