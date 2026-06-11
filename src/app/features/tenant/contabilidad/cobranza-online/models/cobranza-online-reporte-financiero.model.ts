export interface ReporteFinancieroResponse {
  /** Etiquetas de columnas: ["ENE", "FEB", "MAR", "SUMA"] */
  meses: string[];

  // Ingresos ordinarios (401 excl. 401-001-002, 402)
  ingresos: ReporteFinancieroFila[];
  totalIngresos: number[];

  // Gastos generales (601-604, 608, 609)
  gastosGenerales: ReporteFinancieroFila[];
  totalGastos: number[];

  // Subtotal = Ingresos - Gastos
  subtotal: number[];

  // Otros Ingresos (403 - Intereses Ganados / Productos Financieros)
  otrosIngresos: ReporteFinancieroFila[];
  sumaOtros: number[];

  // Resultado del Periodo = Subtotal + SumaOtros
  resultadoPeriodo: number[];

  // Fondo para Mejoras
  fondoMejoras: ReporteFinancieroFondo;
}

export interface ReporteFinancieroFila {
  numeroCuenta: string;
  concepto: string;
  /** Valores por columna; el ultimo elemento es SUMA */
  valores: number[];
}

export interface ReporteFinancieroFondo {
  /** Ingresos amenidades (401-001-002) */
  ingresoAmenidades: ReporteFinancieroFila;
  /** Gastos amenidades (605-xxx) */
  gastosAmenidades: ReporteFinancieroFila[];
  /** Gastos mejoras (606-xxx) */
  gastosMejoras: ReporteFinancieroFila[];
  /**
   * Remanente acumulado rolling.
   * Cada columna = SaldoEjerciciosAnteriores + neto acumulado desde Enero hasta ese mes.
   * Ultimo elemento = remanente al cierre del rango.
   */
  remanenteMejoras: number[];
}
