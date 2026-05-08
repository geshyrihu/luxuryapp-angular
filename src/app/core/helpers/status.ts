// ruta: src/app/core/constants/ticket.constants.ts

/**
 * Mapa que asocia el DisplayName del estado de un ticket con
 * la severidad (color) del componente p-tag de PrimeNG.
 */
export const TICKET_STATUS_SEVERITY: Record<string, string> = {
  Abierto: 'danger',
  Proceso: 'warning',
  Cerrado: 'success',
  Reabierto: 'primary',
};

// Puedes exportar más constantes desde este mismo archivo si lo necesitas
// export const OTRA_CONSTANTE = 'algun_valor';









