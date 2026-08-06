import { Routes } from "@angular/router";

export const COBRANZA_ROUTES: Routes = [
  {
    path: "online",
    loadChildren: () =>
      import("./cobranza-online/cobranza-online.routes").then(
        (m) => m.COBRANZA_ONLINE_ROUTES,
      ),
    data: {
      title: "Cobranza Online",
      breadcrumb: "Cobranza Online",
    },
  },
];
