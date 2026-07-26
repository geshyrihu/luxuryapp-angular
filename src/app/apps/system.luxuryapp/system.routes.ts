import { Routes } from '@angular/router';

export const systemRoutes: Routes = [
  {
    path: 'database-backup',
    loadComponent: () =>
      import('./configuracion-sistema/database-backup/database-backup-list').then(
        (m) => m.DatabaseBackupList,
      ),
  },
];
