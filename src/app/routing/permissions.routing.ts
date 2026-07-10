import { Routes } from "@angular/router";
export const permissionsRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("src/app/apps/auth.luxuryapp/login/login").then(
        (m) => m.LoginComponent,
      ),
    data: {
      title: "Login",
      breadcrumb: "Login",
    },
  },
];
