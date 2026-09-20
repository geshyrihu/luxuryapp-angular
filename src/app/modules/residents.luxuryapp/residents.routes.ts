import { Routes } from "@angular/router";
import { authGuard } from "@core/auth/guards/auth.guard";

export const residentsRoutes: Routes = [
  {
    path: "provider",
    loadComponent: () =>
      import("@operations.luxuryapp/providers/provider-list").then(
        (m) => m.ListProvider,
      ),
    canActivate: [authGuard],
    data: {
      title: "Proveedor",
      breadcrumb: "Proveedor",
    },
  },
  {
    path: "condos",
    loadComponent: () =>
      import("@operations.luxuryapp/owner/owner-list").then(
        (m) => m.OwnerList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Condominos",
      breadcrumb: "Condominos",
    },
  },
  {
    path: "properties",
    loadComponent: () =>
      import("@operations.luxuryapp/properties/propiedades-list").then(
        (m) => m.PropiedadesList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Propiedades",
      breadcrumb: "Propiedades",
    },
  },
  {
    path: "vigilance-committee",
    loadComponent: () =>
      import("@legal.luxuryapp/vigilance-committees/comite-vigilancia-list").then(
        (m) => m.ComiteVigilanciaList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Comité de Vigilancia",
      breadcrumb: "Comité de Vigilancia",
    },
  },
  {
    path: "work-position-org-chart",
    loadComponent: () =>
      import("@recruitment.luxuryapp/employee-org-chart/org-chart").then(
        (m) => m.OrgChart,
      ),
    canActivate: [authGuard],
    data: {
      title: "Organigrama de Puestos",
      breadcrumb: "Organigrama de Puestos",
    },
  },
  {
    path: "internal-staff",
    loadComponent: () =>
      import("@recruitment.luxuryapp/employee-file/employees/employee-registry/employee-list").then(
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
      import("@recruitment.luxuryapp/employee-file/employees/employee-interviewer-queue/employee-interviewer-queue").then(
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
      import("@recruitment.luxuryapp/employee-file/employees/employee-interviewer-queue/employee-interview-response").then(
        (m) => m.EmployeeInterviewResponse,
      ),
    canActivate: [authGuard],
    data: {
      title: "Responder Entrevista",
      breadcrumb: "Responder Entrevista",
    },
  },
  {
    path: "external-staff",
    loadComponent: () =>
      import("@recruitment.luxuryapp/external-staffs/employee-external-list").then(
        (m) => m.EmployeeExternalList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Personal Externo",
      breadcrumb: "Personal Externo",
    },
  },
  {
    path: "emergency-phones",
    loadComponent: () =>
      import("@public.luxuryapp/emergency-phones/telefonos-emergencia").then(
        (m) => m.TelefonosEmergencia,
      ),
    canActivate: [authGuard],
    data: {
      title: "Teléfonos de Emergencia",
      breadcrumb: "Teléfonos de Emergencia",
    },
  },
  {
    path: "my-providers",
    loadComponent: () =>
      import("@admin.luxuryapp/reports/customer-provider/mis-proveedores-list").then(
        (m) => m.MisProveedores,
      ),
    canActivate: [authGuard],
    data: {
      title: "Mis Proveedores",
      breadcrumb: "Mis Proveedores",
    },
  },
];
