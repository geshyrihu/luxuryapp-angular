import { Routes } from "@angular/router";

export const recruitmentRoutes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("src/app/routing/recruitment.routing").then(
        (m) => m.recruitmentRoutes,
      ),
  },
];
