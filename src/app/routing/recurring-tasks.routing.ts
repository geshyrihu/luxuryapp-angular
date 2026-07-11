import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/auth/guards/auth.guard";
export const recurringTasksRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/task-engine/recurring-tasks/templates/task-template-list/task-template-list").then(
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
      import("src/app/apps/operations.luxuryapp/task-engine/recurring-tasks/templates/task-template-items/task-template-items").then(
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
      import("src/app/apps/operations.luxuryapp/task-engine/recurring-tasks/templates/customer-config/customer-config").then(
        (m) => m.CustomerConfig,
      ),
    canActivate: [authGuard],
    data: {
      title: "Configuración por Cliente",
      breadcrumb: "Configuración",
    },
  },
  {
    path: "my-tasks",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/task-engine/recurring-tasks/instances/daily-task-list/daily-task-list").then(
        (m) => m.DailyTaskList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Mis Tareas Diarias",
      breadcrumb: "Mis Tareas",
    },
  },
];
