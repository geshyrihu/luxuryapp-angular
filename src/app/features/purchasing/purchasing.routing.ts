import { Routes } from "@angular/router";
import { comprasRoutes } from "src/app/routing/compras.routing";

export const purchasingRoutes: Routes = [
  {
    path: "",
    children: comprasRoutes,
  },
];
