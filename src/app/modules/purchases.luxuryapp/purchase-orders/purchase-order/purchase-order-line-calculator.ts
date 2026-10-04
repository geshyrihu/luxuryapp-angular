/**
 * Campos mínimos de una línea de Orden de Compra necesarios para calcular
 * SubTotal/Iva/Retenciones/Total. Misma convención que el backend
 * (IPurchaseOrderLineAmounts en PurchaseOrderLineCalculator.cs).
 */
export interface PurchaseOrderLineAmounts {
  cantidad: number;
  precio: number;
  descuento: number;
  ivaAplicado: number;
  retencionIVAPorcentaje: number;
  retencionISRPorcentaje: number;
}

export interface PurchaseOrderLineTotals {
  subtotal: number;
  iva: number;
  retencionIva: number;
  retencionIsr: number;
  total: number;
}

/**
 * Fuente única de la fórmula de totales de una línea de Orden de Compra
 * (SubTotal + IVA - RetenciónIVA - RetenciónISR). Antes esta fórmula estaba
 * copiada en `orden-compra.ts` (totals computed), `create-orden-compra-wizard.ts`
 * (calculateItemSubtotal/calculateItemTotal) y `pdf-generation.service.ts`
 * (buildOrdenCompraHtmlContent) — riesgo real: corregir la fórmula en un lugar
 * y olvidar los otros.
 */
export function calculatePurchaseOrderLineTotals(
  item: PurchaseOrderLineAmounts,
): PurchaseOrderLineTotals {
  const subtotal = item.cantidad * item.precio * (1 - item.descuento / 100);
  const iva = subtotal * (item.ivaAplicado / 100);
  const retencionIva = subtotal * (item.retencionIVAPorcentaje / 100);
  const retencionIsr = subtotal * (item.retencionISRPorcentaje / 100);
  const total = subtotal + iva - retencionIva - retencionIsr;

  return { subtotal, iva, retencionIva, retencionIsr, total };
}

/** Suma los totales de varias líneas (útil para carátulas/PDF con múltiples partidas). */
export function sumPurchaseOrderLineTotals(
  items: PurchaseOrderLineAmounts[],
): PurchaseOrderLineTotals {
  return items.reduce<PurchaseOrderLineTotals>(
    (acc, item) => {
      const line = calculatePurchaseOrderLineTotals(item);
      return {
        subtotal: acc.subtotal + line.subtotal,
        iva: acc.iva + line.iva,
        retencionIva: acc.retencionIva + line.retencionIva,
        retencionIsr: acc.retencionIsr + line.retencionIsr,
        total: acc.total + line.total,
      };
    },
    { subtotal: 0, iva: 0, retencionIva: 0, retencionIsr: 0, total: 0 },
  );
}
