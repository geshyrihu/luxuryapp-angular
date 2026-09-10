import { signal } from "@angular/core";

/**
 * Estado compartido de filtro para el módulo CobranzaOnline.
 *
 * PRECEDENCIA DE FUENTE DE VERDAD:
 * - Este estado (year/month/day) es la fuente oficial para las vistas que representan
 *   el mismo "corte mensual": wrapper, resumen, inspection, department-charges,
 *   department-payments, towers, advances, debtors.
 *
 * - Las siguientes vistas mantienen sus propios filtros por tener requisitos distintos:
 *   * analysis: usa `cutoffDateInput` (fecha de corte específica con day picker)
 *   * reporte-financiero: usa `currentYear` + `mesInicio`/`mesFin` (rango de meses)
 *   * exclusions: usa solo `currentYear` (filtro anual)
 *
 * No propagar este estado a vistas con semántica de filtro diferente; documentar
 * su independencia en cada componente.
 */
export const cobranzaOnlineFilterState = {
  year: signal<number>(new Date().getFullYear()),
  month: signal<number>(new Date().getMonth() + 1),
  day: signal<number>(new Date().getDate()),
};
