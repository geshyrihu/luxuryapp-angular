export interface PresupuestoContabilidadResponse {
  nombreEmpresa: string;
  periodoPresupuesto: string;
  anio: number;
  mes: number;
  /** Etiquetas de columnas de ejercido: ["ENE","FEB","MAR","ABR"] hasta el mes de corte. */
  columnas: string[];
  filas: PresupuestoContabilidadFila[];
  granTotal: PresupuestoContabilidadFila;
}

export interface PresupuestoContabilidadFila {
  numeroCuenta: string;
  descripcion: string;
  /**
   * 1 = CuentaMayor (601-000-000)
   * 2 = Subcuenta (601-001-000)
   * 3 = Detalle (601-001-001)
   * 4 = Fila total / gran total
   */
  nivel: number;
  /** Presupuesto anual / 12 */
  pstoMensual: number;
  /** Ejercido real por mes, longitud = mes de corte */
  montosEjercidos: number[];
  /** Suma de montosEjercidos */
  acumuladoAnual: number;
  /** Suma de los 12 meses de presupuesto */
  presupAnual: number;
  /** presupAnual - acumuladoAnual */
  presupRestante: number;
}
