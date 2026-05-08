import { Routes } from "@angular/router";
export const permissionsRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("src/app/login/login/login").then(
        (m) => m.LoginComponent
      ),
    data: {
      title: "Login",
      breadcrumb: "Login",
    },
  },
];










