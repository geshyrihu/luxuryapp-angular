import { Routes } from "@angular/router";

export const diagramRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("src/app/features/operations/diagrams/diagram/diagram-list/diagram-list").then(
        (m) => m.DiagramList,
      ),
  },
  {
    path: "editor/:id",
    loadComponent: () =>
      import("src/app/features/operations/diagrams/diagram/diagram-editor/diagram-editor").then(
        (m) => m.DiagramEditor,
      ),
  },
  {
    path: "gallery",
    loadComponent: () =>
      import("src/app/features/operations/diagrams/diagram/diagram-gallery/diagram-gallery").then(
        (m) => m.DiagramGallery,
      ),
  },
  {
    path: "view/:id",
    loadComponent: () =>
      import("src/app/features/operations/diagrams/diagram/diagram-view/diagram-view").then(
        (m) => m.DiagramView,
      ),
  },
];
