export const EndpointsCompras = {
  PurchaseHistory: {
    listPaid: (
      customerId: string,
      estadoPago?: number | null,
      estatus?: number | null,
      tipoGasto?: number | null,
      tipoOrden?: number | null,
      fechaInicio?: string | null,
      fechaFin?: string | null,
    ) => {
      const queryParams = new URLSearchParams();

      if (estadoPago !== null && estadoPago !== undefined) {
        queryParams.set("estadoPago", String(estadoPago));
      }

      if (estatus !== null && estatus !== undefined) {
        queryParams.set("estatus", String(estatus));
      }

      if (tipoGasto !== null && tipoGasto !== undefined) {
        queryParams.set("tipoGasto", String(tipoGasto));
      }

      if (tipoOrden !== null && tipoOrden !== undefined) {
        queryParams.set("tipoOrden", String(tipoOrden));
      }

      if (fechaInicio) {
        queryParams.set("fechaInicio", fechaInicio);
      }

      if (fechaFin) {
        queryParams.set("fechaFin", fechaFin);
      }

      const queryString = queryParams.toString();
      return queryString
        ? `compras/historial-compras/pagadas/${customerId}?${queryString}`
        : `compras/historial-compras/pagadas/${customerId}`;
    },
  },
} as const;
