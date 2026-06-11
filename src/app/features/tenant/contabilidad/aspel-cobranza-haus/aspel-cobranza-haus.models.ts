export type AspelQueryMode =
  | "accounts"
  | "estado-cuenta-rango"
  | "detalle-cobranza-rango"
  | "contrapartidas-rango"
  | "pendientes-concepto-rango"
  | "deudas-actuales";

export interface SelectItem<T = string> {
  label: string;
  value: T;
  isSelected?: boolean | null;
  image?: string | null;
}

export interface AspelCustomer {
  customerId: string;
  name: string;
}

export interface AspelAccount {
  numCta: string;
  nombre: string;
  estatus: string;
}

export interface AspelAccountsByCustomerResponse {
  customerId: string;
  totalCondominos: number;
  cuentas: AspelAccount[];
}

export interface AspelMovimiento {
  id: string;
  numCta: string;
  fecha: string;
  tipo: string;
  concepto: string;
  monto: number;
  saldoAnterior: number;
  saldoPosterior: number;
}

export interface AspelEstadoCuentaResponse {
  numCta: string;
  departamento: string;
  fechaInicio: string;
  fechaFin: string;
  saldoInicial: number;
  saldoFinal: number;
  movimientos: AspelMovimiento[];
  num_cta?: string;
  fecha_Inicio?: string;
  fecha_Fin?: string;
  saldo_Inicial?: number;
  saldo_Final?: number;
}

export interface AspelContrapartidaMovimiento {
  id: string;
  fecha: string;
  concepto: string;
  monto: number;
  tipo: string;
}

export interface AspelContrapartidaGrupo {
  numCtaContra: string;
  nombreCuenta: string;
  totalMonto: number;
  totalMovimientos: number;
  movimientos: AspelContrapartidaMovimiento[];
  num_cta_contra?: string;
  nombre_cuenta?: string;
  total_monto?: number;
  total_movimientos?: number;
}

export interface AspelContrapartidaResponse {
  numCtaBase: string;
  departamento: string;
  fechaInicio: string;
  fechaFin: string;
  saldoInicial: number;
  saldoFinal: number;
  totalMovimientos: number;
  grupos: AspelContrapartidaGrupo[];
  saldosFinalesPorConcepto: Record<string, number>[];
  num_cta_base?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  saldo_Inicial?: number;
  saldo_Final?: number;
  total_movimientos?: number;
  saldos_finales_por_concepto?: Record<string, number>[];
}

export interface AspelPendienteConceptoItem {
  numCta: string;
  nombreCuenta: string;
  concepto: string;
  saldoInicial: number;
  cargos: number;
  abonos: number;
  saldoPendiente: number;
  num_cta?: string;
  nombre_cuenta?: string;
  saldo_inicial?: number;
  saldo_pendiente?: number;
}

export interface AspelPendientesConceptoResponse {
  numCtaBase: string;
  departamento: string;
  fechaInicio: string;
  fechaFin: string;
  totalConceptos: number;
  conceptos: AspelPendienteConceptoItem[];
  num_cta_base?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  total_conceptos?: number;
}

export interface AspelDeudaActualItem {
  numCtaBase: string;
  departamento: string;
  saldoActual: number;
  tieneDesgloseConceptos: boolean;
  totalConceptos: number;
  num_cta_base?: string;
  saldo_actual?: number;
  tiene_desglose_conceptos?: boolean;
  total_conceptos?: number;
}

export interface AspelDeudasActualesResponse {
  customerId: string;
  fechaCorte: string;
  totalPropiedadesConDeuda: number;
  totalDeudaActual: number;
  propiedades: AspelDeudaActualItem[];
  customer_id?: string;
  fecha_corte?: string;
  total_propiedades_con_deuda?: number;
  total_deuda_actual?: number;
}

export interface AspelCobranzaDetalleConcepto {
  numCta: string;
  nombreCuenta: string;
  concepto: string;
  saldoInicial: number;
  cargos: number;
  abonos: number;
  saldoFinal: number;
  totalVencido: number;
  adelanto: number;
  vencidos: AspelCobranzaDetalleVencido[];
  num_cta?: string;
  nombre_cuenta?: string;
  saldo_inicial?: number;
  saldo_final?: number;
  total_vencido?: number;
}

export interface AspelCobranzaDetalleVencido {
  fechaCargo: string;
  conceptoDetalle: string;
  saldoPendiente: number;
  fecha_cargo?: string;
  concepto_detalle?: string;
  saldo_pendiente?: number;
}

export interface AspelCobranzaDetalleResponse {
  numCtaBase: string;
  departamento: string;
  fechaInicio: string;
  fechaFin: string;
  saldoInicialTotal: number;
  totalCargos: number;
  totalAbonos: number;
  saldoFinalTotal: number;
  totalAdelantos: number;
  totalConceptos: number;
  conceptos: AspelCobranzaDetalleConcepto[];
  num_cta_base?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  saldo_inicial_total?: number;
  total_cargos?: number;
  total_abonos?: number;
  saldo_final_total?: number;
  total_adelantos?: number;
  total_conceptos?: number;
}

export interface AspelQueryRequest {
  numCta: string | null;
  fechaInicio: Date | null;
  fechaFin: Date | null;
}
