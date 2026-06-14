import { Routes } from "@angular/router";

export const PASSWORD_MANAGER_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/password-list").then((m) => m.PasswordList),
  },
];
