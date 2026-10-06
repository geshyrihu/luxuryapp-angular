import { Routes } from "@angular/router";
import { authGuard } from "@core/auth/guards/auth.guard";
import { hasRolesGuard } from "@core/auth/guards/has-roles.guard";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";

// RN-CFD-021 (D5/D5b/D6): mismos 8 roles para disparar descargas y consultar.
// Cargar/reemplazar la e.firma (RN-CFD-020/D15/D17, solo SuperUsuario/Direccion)
// se controla dentro del componente, no a nivel de ruta — es una acción, no una página.
const MODULE_ROLES: ApplicationRole[] = [
  ApplicationRole.SuperUsuario,
  ApplicationRole.Administrador,
  ApplicationRole.Contador,
  ApplicationRole.GerenteOperaciones,
  ApplicationRole.GerenteAtencion,
  ApplicationRole.Asistente,
  ApplicationRole.GerenteMantenimiento,
  ApplicationRole.SupervisionOperativa];

export const cfdiDownloadRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./cfdi-download-hub/cfdi-download-hub").then((m) => m.CfdiDownloadHub),
    canActivate: [authGuard, hasRolesGuard],
    data: {
      title: "Descarga Masiva de CFDI",
      breadcrumb: "CFDI del SAT",
      allowedRoles: MODULE_ROLES,
    },
  }];
