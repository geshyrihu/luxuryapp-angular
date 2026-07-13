import { Routes } from '@angular/router';

export const residentRoutes: Routes = [
  {
    path: 'access-control/visitas',
    loadComponent: () =>
      import('./access-control/visit-list').then((m) => m.VisitList),
  },
  {
    path: 'access-control/visitas/nueva',
    loadComponent: () =>
      import('./access-control/visit-form').then((m) => m.VisitForm),
  },
];
