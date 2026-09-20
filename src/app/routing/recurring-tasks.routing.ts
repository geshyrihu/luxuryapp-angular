import { Routes } from "@angular/router";
import { authGuard } from "@core/auth/guards/auth.guard";
export const recurringTasksRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("@operations.luxuryapp/task/recurring-tasks/templates/task-template-list/task-template-list").then(
        (m) => m.TaskTemplateList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Plantillas de Tareas Recurrentes",
      breadcrumb: "Plantillas de Tareas",
    },
  },
  {
    path: ":id/items",
    loadComponent: () =>
      import("@operations.luxuryapp/task/recurring-tasks/templates/task-template-items/task-template-items").then(
        (m) => m.TaskTemplateItems,
      ),
    canActivate: [authGuard],
    data: {
      title: "Items de Plantilla",
      breadcrumb: "Items",
    },
  },
  {
    path: "customer-config",
    loadComponent: () =>
      import("@operations.luxuryapp/task/recurring-tasks/templates/customer-config/customer-config").then(
        (m) => m.CustomerConfig,
      ),
    canActivate: [authGuard],
    data: {
      title: "Configuración por Cliente",
      breadcrumb: "Configuración",
    },
  },
  {
    path: "compliance",
    loadComponent: () =>
      import("@operations.luxuryapp/task/recurring-tasks/compliance/recurring-task-compliance-dashboard/recurring-task-compliance-dashboard").then(
        (m) => m.RecurringTaskComplianceDashboard,
      ),
    canActivate: [authGuard],
    data: {
      title: "Tablero de Cumplimiento Recurrente",
      breadcrumb: "Cumplimiento",
    },
  },
  {
    path: "my-tasks",
    loadComponent: () =>
      import("@operations.luxuryapp/task/recurring-tasks/instances/daily-task-list/daily-task-list").then(
        (m) => m.DailyTaskList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Mis Tareas Diarias",
      breadcrumb: "Mis Tareas",
    },
  },
];


