import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/guard/auth.guard";
export const authRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("src/app/login/login/login").then(
        (m) => m.LoginComponent,
      ),
    data: {
      title: "Login",
      breadcrumb: "Login",
    },
  },
  {
    path: "login",
    loadComponent: () =>
      import("src/app/login/login/login").then(
        (m) => m.LoginComponent,
      ),
    data: {
      title: "Login",
      breadcrumb: "Login",
    },
  },
  {
    path: "recovery-password",
    loadComponent: () =>
      import("src/app/login/recovery-password/recovery-wrapper").then(
        (m) => m.RecoveryWrapper,
      ),
    data: {
      title: "Recuperar Contraseña", // Ajustado a mayúsculas
      breadcrumb: "Recuperar Contraseña",
    },
  },
  {
    path: "reset-password",
    loadComponent: () =>
      import("src/app/login/reset-password/reset-password").then(
        (m) => m.ResetPassword,
      ),
    data: {
      title: "Restablecer Contraseña",
      breadcrumb: "Restablecer Contraseña",
    },
  },
  {
    path: "update-user-profile",
    loadComponent: () =>
      import("src/app/features/tenant/user-profile/update-profile").then(
        (m) => m.UpdateProfile,
      ),
    canActivate: [authGuard],
    data: {
      title: "Actualizar Perfil",
      breadcrumb: "Actualizar Perfil",
    },
  },
];











