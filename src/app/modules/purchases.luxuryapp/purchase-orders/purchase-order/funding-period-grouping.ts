import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { PurchaseOrderFundingPeriodGroup } from "./purchase-order.types";

/**
 * Fuente única de la agrupación de periodos de fondeo (quincenas) por mes.
 * Antes esta lógica estaba copiada en `create-orden-compra-wizard.ts` y
 * `forms/orden-compra-datos-pago.ts` con una pequeña divergencia (el guard
 * `if (period && period.label)`), riesgo de que una copia se corrija y la
 * otra no.
 */
export function groupFundingPeriodsByMonth(
  periods: SelectItemDto[],
): PurchaseOrderFundingPeriodGroup[] {
  const months: Record<string, PurchaseOrderFundingPeriodGroup> = {};

  periods.forEach((period) => {
    if (!period || !period.label) return;

    const monthName = period.label.split(" ")[2];
    if (!months[monthName]) {
      months[monthName] = { monthName, quincenas: [] };
    }
    months[monthName].quincenas.push(period);
  });

  return Object.values(months);
}

/** Opciones de año (actual -1, actual, actual +1) para selects de año fiscal/fondeo. */
export function generateYearOptions(): SelectItemDto[] {
  const currentYear = new Date().getFullYear();
  return [
    { label: (currentYear - 1).toString(), value: currentYear - 1 },
    { label: currentYear.toString(), value: currentYear },
    { label: (currentYear + 1).toString(), value: currentYear + 1 }];
}

/**
 * Lógica de toggle al seleccionar una quincena: si ya estaba seleccionada,
 * la deselecciona (null); si no, la selecciona.
 */
export function toggleFundingPeriodSelection(
  currentValue: number | null | undefined,
  clickedValue: number,
): number | null {
  return currentValue === clickedValue ? null : clickedValue;
}
