export interface AspelCustomer {
  customerId: string;
  name: string;
}

export interface AspelAccount {
  numCta: string;
  nombre: string;
  estatus: string;
}

export interface SelectItem<T = string> {
  label: string;
  value: T;
  isSelected?: boolean | null;
  image?: string | null;
}

export interface AspelAccountsByCustomerResponse {
  customerId: string;
  totalCondominos: number;
  cuentas: AspelAccount[];
}

export interface AspelMovimiento {
  id: string;
  fecha: string;
  tipo: string;
  concepto: string;
  monto: number;
  saldo_Anterior: number;
  saldo_Posterior: number;
}

export interface AspelEstadoCuentaResponse {
  num_cta: string;
  departamento: string;
  fecha_Inicio: string;
  fecha_Fin: string;
  saldo_Inicial: number;
  saldo_Final: number;
  total_Movimientos: number;
  movimientos: AspelMovimiento[];
  saldos_finales_por_concepto: Record<string, number>[];
}
export interface EstadoCuentaRequest {
  customerId: string;
  numCta: string;
  fechaInicio: Date | null;
  fechaFin: Date | null;
}

export interface AspelContrapartidaMovimiento {
  id: string;
  fecha: string;
  concepto: string;
  monto: number;
  tipo: string;
}

export interface AspelContrapartidaGrupo {
  num_cta_contra: string;
  nombre_cuenta: string;
  total_monto: number;
  total_movimientos: number;
  movimientos: AspelContrapartidaMovimiento[];
}

export interface AspelContrapartidaResponse {
  num_cta_base: string;
  departamento: string;
  fecha_inicio: string;
  fecha_fin: string;
  saldo_Inicial: number;
  saldo_Final: number;
  total_movimientos: number;
  grupos: AspelContrapartidaGrupo[];
  saldos_finales_por_concepto: Record<string, number>[];
}

export interface ContrapartidaRequest {
  customerId: string;
  numCta: string;
  fechaInicio: Date | null;
  fechaFin: Date | null;
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

export interface PendientesConceptoRequest {
  numCta: string;
  fechaInicio: Date | null;
  fechaFin: Date | null;
}
