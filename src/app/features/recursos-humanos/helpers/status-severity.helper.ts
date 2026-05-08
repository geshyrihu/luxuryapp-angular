/**
 * Convierte un estado de solicitud (como string) a la severidad de PrimeNG.
 * @param status El estado como string (ej. "Aprobada", "Pendiente", etc.)
 * @returns La severidad: 'success' | 'danger' | 'info' | 'warn'
 */
export function getStatusSeverity(status: string): 'success' | 'danger' | 'info' | 'warn' {
  switch (status?.trim()) {
    case 'Aprobada':
      return 'success';
    case 'Rechazada':
      return 'danger';
    case 'Cancelada':
      return 'info';
    case 'Pendiente':
    default:
      return 'warn';
  }
}









