import { Routes } from "@angular/router";

export const COBRANZA_ROUTES: Routes = [
  {
    path: "aspel-online",
    loadChildren: () =>
      import("./cobranza-online/aspel-cobranza-online.routes").then(
        (m) => m.COBRANZA_ONLINE_ROUTES,
      ),
    data: {
      title: "Cobranza Online",
      breadcrumb: "Cobranza Online",
    },
  },
];
