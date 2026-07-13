import { Routes } from '@angular/router';

export const securityRoutes: Routes = [
  {
    path: 'access-control/escaneo',
    loadComponent: () =>
      import('./access-control/access-scan').then((m) => m.AccessScan),
  },
  {
    path: 'access-control/activas',
    loadComponent: () =>
      import('./access-control/active-visits').then((m) => m.ActiveVisits),
  },
];
