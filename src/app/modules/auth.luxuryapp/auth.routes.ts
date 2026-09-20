import { Routes } from "@angular/router";
import { authGuard } from "@core/auth/guards/auth.guard";
export const authRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("@auth.luxuryapp/auth/login-wrapper").then(
        (m) => m.LoginWrapper,
      ),
    data: {
      title: "Login",
      breadcrumb: "Login",
    },
  },
  {
    path: "login",
    loadComponent: () =>
      import("@auth.luxuryapp/auth/login-wrapper").then(
        (m) => m.LoginWrapper,
      ),
    data: {
      title: "Login",
      breadcrumb: "Login",
    },
  },
  {
    path: "reset-password",
    loadComponent: () =>
      import("@auth.luxuryapp/account-recovery/reset-password/reset-password-wrapper").then(
        (m) => m.ResetPasswordWrapper,
      ),
    data: {
      title: "Restablecer Contraseña",
      breadcrumb: "Restablecer Contraseña",
    },
  },
  {
    path: "recovery-code",
    loadComponent: () =>
      import("@auth.luxuryapp/account-recovery/recovery-code/recovery-code-wrapper").then(
        (m) => m.RecoveryCodeWrapper,
      ),
    data: {
      title: "Código de Verificación",
      breadcrumb: "Código de Verificación",
    },
  },
  {
    path: "update-user-profile",
    loadComponent: () =>
      import("@auth.luxuryapp/profile-users/update-profile-wrapper").then(
        (m) => m.UpdateProfileWrapper,
      ),
    canActivate: [authGuard],
    data: {
      title: "Actualizar Perfil",
      breadcrumb: "Actualizar Perfil",
    },
  },
];


