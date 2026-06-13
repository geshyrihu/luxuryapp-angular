import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/guard/auth.guard";
export const employeeEvaluationRoutes: Routes = [
  // 1. Ruta para la creación de plantillas de evaluación
  {
    path: "templates/list",
    loadComponent: () =>
      import("src/app/features/tenant/evaluation-template/lista-plantilla-evaluacion").then(
        (m) => m.ListaPlantillaEvaluacion,
      ),
    canActivate: [authGuard],
    data: {
      title: "Plantillas de Evaluación",
      breadcrumb: "Plantillas de Evaluación",
    },
  },
  // 2. Ruta para la administración de plantillas de evaluación
  {
    path: "templates/create",
    loadComponent: () =>
      import("src/app/features/tenant/evaluation-template/formulario-plantilla-evaluacion").then(
        (m) => m.FormularioPlantillaEvaluacion,
      ),
    canActivate: [authGuard],
    data: {
      title: "Crear plantilla de evaluación",
      breadcrumb: "Crear  plantilla de evaluación",
    },
  },
  // 2. Ruta para la edicion de plantillas de evaluación
  {
    path: "templates/edit/:id",
    loadComponent: () =>
      import("src/app/features/tenant/evaluation-template/formulario-plantilla-evaluacion").then(
        (m) => m.FormularioPlantillaEvaluacion,
      ),
    canActivate: [authGuard],
    data: {
      title: "Editar plantilla de evaluación",
      breadcrumb: "Editar  plantilla de evaluación",
    },
  },
  // 2. Ruta para la página donde se realiza activamente una evaluación
  {
    path: "conduct/create",
    loadComponent: () =>
      import("src/app/features/tenant/evaluation-template/performance-evaluation/realizar-evaluacion").then(
        (m) => m.RealizarEvaluacion,
      ),
    canActivate: [authGuard],
    data: {
      title: "Realizar Evaluación",
      breadcrumb: "Realizar Evaluación",
    },
  },
  {
    path: "conduct/edit/:id",
    loadComponent: () =>
      import("src/app/features/tenant/evaluation-template/performance-evaluation/realizar-evaluacion").then(
        (m) => m.RealizarEvaluacion,
      ),
    canActivate: [authGuard],
    data: {
      title: "Editar Evaluación",
      breadcrumb: "Editar Evaluación",
    },
  },
  {
    path: "conduct/list",
    loadComponent: () =>
      import("src/app/features/tenant/evaluation-template/performance-evaluation/lista-evaluacion-realizada").then(
        (m) => m.ListaEvaluacionRealizada,
      ),
    canActivate: [authGuard],
    data: {
      title: "Lista de Evaluaciones",
      breadcrumb: "Lista de Evaluaciones",
    },
  },
  // 3. Ruta para ver el historial de evaluaciones de un empleado
  {
    path: "employee/:employeeId/history",
    loadComponent: () =>
      import("src/app/features/tenant/evaluation-template/performance-evaluation/historial-evaluacion").then(
        (m) => m.HistorialEvaluacion,
      ),
    canActivate: [authGuard],
    data: {
      title: "Historial de Evaluaciones",
      breadcrumb: "Historial de Evaluaciones",
    },
  },
  // 4. Ruta para ver el reporte de resultados de una evaluación específica
  {
    path: "result/:id", // El :id es el PerformanceEvaluationId
    loadComponent: () =>
      import("src/app/features/tenant/evaluation-template/performance-evaluation/resultado-evaluacion").then(
        (m) => m.ResultadoEvaluacion,
      ),
    canActivate: [authGuard],
    data: {
      title: "Resultado de Evaluación",
      breadcrumb: "Resultado de Evaluación",
    },
  },
];

