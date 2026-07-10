import { Routes } from "@angular/router";
import { Loader } from "@ui/mobile/loader/loader";
import { authGuard } from "./core/auth/guards/auth.guard";
import { committeeGuard } from "./core/auth/guards/committee.guard";
import { direccionGuard } from "./core/auth/guards/direccion.guard";
import { employeeGuard } from "./core/auth/guards/employee.guard";
import { roleRedirectGuard } from "./core/auth/guards/role-redirect.guard";
import { LayoutCommittee } from "./core/layout/committee-view/layout-committee";
import { LayoutDireccion } from "./core/layout/direccion-view/layout-direccion";
import { LayoutEmployee } from "./core/layout/employee-view/layout-employee";

/**
 * Rutas Principales de la Aplicación: El Gran Distribuidor 🚦
 *
 * Este es el mapa maestro de la aplicación. Aquí se decide a dónde va el usuario
 * basándose en la URL y su estado de autenticación.
 *
 * El Flujo es el siguiente:
 *   1. Rutas públicas como `auth` y `publico` son de libre acceso. Sin guardias, sin problemas.
 *   2. La ruta raíz (`''`) es la más inteligente. Primero, el `AuthGuard` te pide tus credenciales (¿estás en la lista?).
 *      Luego, el `roleRedirectGuard` (el portero) te mira de arriba abajo y te manda al layout que te corresponde.
 *   3. La ruta `/app` es el contenedor de las zonas privadas. Dentro de ella, se decide si se carga el `FullLayoutComponent`
 *      (la fiesta para empleados) o el `MinimalLayoutComponent` (la sala de juntas para el comité).
 *   4. Cada layout tiene sus propias rutas hijas (`loadChildren`), manteniendo todo ordenado y modular.
 */
export const appRoutes: Routes = [
  {
    path: "auth",
    loadChildren: () =>
      import("src/app/apps/auth.luxuryapp/auth.routes").then(
        (m) => m.authRoutes,
      ),
  },
  {
    path: "web",
    loadChildren: () =>
      import("src/app/features/web/web.routing").then((m) => m.webRoutes),
    data: { title: "Inicio", breadcrumb: "Inicio" },
  },
  {
    path: "publico",
    loadChildren: () =>
      import("src/app/routing/public.routing").then((m) => m.publicRoutes),
  },
  {
    path: "offline",
    loadComponent: () =>
      import("src/app/core/pages-extras/offline/offline").then(
        (m) => m.Offline,
      ),
    data: {
      title: "Sin Conexión",
    },
  },
  {
    path: "unauthorized",
    loadComponent: () =>
      import("src/app/core/pages-extras/unauthorized/unauthorized").then(
        (m) => m.Unauthorized,
      ),
    data: {
      title: "Acceso No Autorizado",
      breadcrumb: "Acceso No Autorizado",
    },
  },

  {
    path: "page404",
    loadComponent: () =>
      import("src/app/core/pages-extras/page404/page404").then(
        (m) => m.Page404,
      ),
    data: {
      title: "Página No Encontrada",
    },
  },

  // --- El Corazón de la Redirección --- //
  {
    path: "",
    pathMatch: "full",
    canActivate: [authGuard, roleRedirectGuard],
    // Este componente nunca se renderiza, porque el guardián SIEMPRE redirige.
    // Es solo un peón en el juego del enrutamiento. ♟️
    component: Loader, // Un componente cualquiera y ligero
  },

  // --- Ruta para Comite (Nivel Superior) ---
  {
    path: "committee",
    component: LayoutCommittee,
    canActivate: [authGuard, committeeGuard],
    loadChildren: () =>
      import("src/app/features/operations/meetings/committee/committee.routing").then(
        (m) => m.committeeRoutes,
      ),
  },

  // --- Ruta para Direccion (Nivel Superior) ---
  {
    path: "direccion",
    component: LayoutDireccion,
    canActivate: [authGuard, direccionGuard],
    loadChildren: () =>
      import("src/app/features/operations/direccion/direccion.routing").then(
        (m) => m.direccionRoutes,
      ),
  },

  // --- Rutas de Empleado (Full Layout) ---
  // Esta será la ruta por defecto para usuarios no-comité.
  // Captura la raíz y todas las demás rutas (dashboard, home, etc.) definidas en pages.routing.
  {
    path: "",
    component: LayoutEmployee,
    canActivate: [authGuard, employeeGuard],
    loadChildren: () =>
      import("src/app/routing/pages.routes").then((m) => m.pagesRoutes),
  },

  // --- Wildcard Route (Captura todo lo demás) ---
  // IMPORTANTE: Debe ser SIEMPRE la última ruta.
  {
    path: "**",
    redirectTo: "page404",
  },
];
