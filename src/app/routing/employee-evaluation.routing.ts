import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/guard/auth.guard";
export const employeeEvaluationRoutes: Routes = [
  // 1. Ruta para la creaciÃ³n de plantillas de evaluaciÃ³n
  {
    path: "templates/list",
    loadComponent: () =>
      import("src/app/features/tenant/evaluation-template/lista-plantilla-evaluacion").then(
        (m) => m.ListaPlantillaEvaluacion,
      ),
    canActivate: [authGuard],
    data: {
      title: "Plantillas de EvaluaciÃ³n",
      breadcrumb: "Plantillas de EvaluaciÃ³n",
    },
  },
  // 2. Ruta para la administraciÃ³n de plantillas de evaluaciÃ³n
  {
    path: "templates/create",
    loadComponent: () =>
      import("src/app/features/tenant/evaluation-template/formulario-plantilla-evaluacion").then(
        (m) => m.FormularioPlantillaEvaluacion,
      ),
    canActivate: [authGuard],
    data: {
      title: "Crear plantilla de evaluaciÃ³n",
      breadcrumb: "Crear  plantilla de evaluaciÃ³n",
    },
  },
  // 2. Ruta para la edicion de plantillas de evaluaciÃ³n
  {
    path: "templates/edit/:id",
    loadComponent: () =>
      import("src/app/features/tenant/evaluation-template/formulario-plantilla-evaluacion").then(
        (m) => m.FormularioPlantillaEvaluacion,
      ),
    canActivate: [authGuard],
    data: {
      title: "Editar plantilla de evaluaciÃ³n",
      breadcrumb: "Editar  plantilla de evaluaciÃ³n",
    },
  },
  // 2. Ruta para la pÃ¡gina donde se realiza activamente una evaluaciÃ³n
  {
    path: "conduct/create",
    loadComponent: () =>
      import("src/app/features/tenant/evaluation-template/performance-evaluation/realizar-evaluacion").then(
        (m) => m.RealizarEvaluacion,
      ),
    canActivate: [authGuard],
    data: {
      title: "Realizar EvaluaciÃ³n",
      breadcrumb: "Realizar EvaluaciÃ³n",
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
      title: "Editar EvaluaciÃ³n",
      breadcrumb: "Editar EvaluaciÃ³n",
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
  // 4. Ruta para ver el reporte de resultados de una evaluaciÃ³n especÃ­fica
  {
    path: "result/:id", // El :id es el PerformanceEvaluationId
    loadComponent: () =>
      import("src/app/features/tenant/evaluation-template/performance-evaluation/resultado-evaluacion").then(
        (m) => m.ResultadoEvaluacion,
      ),
    canActivate: [authGuard],
    data: {
      title: "Resultado de EvaluaciÃ³n",
      breadcrumb: "Resultado de EvaluaciÃ³n",
    },
  },
];

