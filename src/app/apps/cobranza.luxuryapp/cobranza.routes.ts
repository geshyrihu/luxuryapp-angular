import { Routes } from "@angular/router";

export const COBRANZA_ROUTES: Routes = [
  {
    path: "aspel-online",
    loadChildren: () =>
      import("./cobranza-online/aspel-cobranza-online.routes").then(
        (m) => m.COBRANZA_ONLINE_ROUTES,
      ),
    data: {
      title: "Aspel Online",
      breadcrumb: "Aspel Online",
    },
  },
  // Ruta legacy: `online` se renombró a `aspel-online`. Se conserva el redirect para
  // no romper deeplinks, favoritos ni enlaces guardados en correos previos.
  {
    path: "online",
    redirectTo: "aspel-online",
  },
];
