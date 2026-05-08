export interface EstadoCuentaDto {
  num_Cta: string;
  nombre: string;
  saldoInicial: number;
  periodo: number;
  fecha_Pol: string;
  concep_Po: string;
  debe_Me: number;
  haber_Me: number;
}

export interface AspelCuentaDto {
  banco: number | null;
  bancoextra: string | null;
  bandajt: string | null;
  bandmulti: number | null;
  capcheqtipo: string | null;
  capturache: number | null;
  capturauuid: number | null;
  codagrup: string | null;
  cta_Comp: string | null;
  cta_Papa: string | null;
  cta_Raiz: string | null;
  ctabancaria: string | null;
  deptsino: string | null;
  esflujodeefe: number | null;
  idfiscal: string | null;
  naturaleza: number | null;
  nivel: number | null;
  noincluirxm: number | null;
  nombre: string | null;
  num_Cta: string | null;
  rfc: string | null;
  rfcflujo: string | null;
  status: string | null;
  tipo: string | null;
}

export interface AspelPresupuestoDto {
  ejercicio: number | null;
  num_Cta: string | null;
  presup01: number | null;
  presup02: number | null;
  presup03: number | null;
  presup04: number | null;
  presup05: number | null;
  presup06: number | null;
  presup07: number | null;
  presup08: number | null;
  presup09: number | null;
  presup10: number | null;
  presup11: number | null;
  presup12: number | null;
  presup13: number | null;
  presup14: number | null;
}

export interface AspelSaldoDto {
  num_Cta: string | null;
  ejercicio: number | null;
  inicial: number | null;
  inicialex: number | null;
  
  mov01: number | null;
  mov02: number | null;
  mov03: number | null;
  mov04: number | null;
  mov05: number | null;
  mov06: number | null;
  mov07: number | null;
  mov08: number | null;
  mov09: number | null;
  mov10: number | null;
  mov11: number | null;
  mov12: number | null;
  mov13: number | null;
  mov14: number | null;
  
  cargo01: number | null;
  cargo02: number | null;
  cargo03: number | null;
  cargo04: number | null;
  cargo05: number | null;
  cargo06: number | null;
  cargo07: number | null;
  cargo08: number | null;
  cargo09: number | null;
  cargo10: number | null;
  cargo11: number | null;
  cargo12: number | null;
  cargo13: number | null;
  cargo14: number | null;

  cargoex01: number | null;
  cargoex02: number | null;
  cargoex03: number | null;
  cargoex04: number | null;
  cargoex05: number | null;
  cargoex06: number | null;
  cargoex07: number | null;
  cargoex08: number | null;
  cargoex09: number | null;
  cargoex10: number | null;
  cargoex11: number | null;
  cargoex12: number | null;

  abono01: number | null;
  abono02: number | null;
  abono03: number | null;
  abono04: number | null;
  abono05: number | null;
  abono06: number | null;
  abono07: number | null;
  abono08: number | null;
  abono09: number | null;
  abono10: number | null;
  abono11: number | null;
  abono12: number | null;

  abonoex01: number | null;
  abonoex02: number | null;
  abonoex03: number | null;
  abonoex04: number | null;
  abonoex05: number | null;
  abonoex06: number | null;
  abonoex07: number | null;
  abonoex08: number | null;
  abonoex09: number | null;
  abonoex10: number | null;
  abonoex11: number | null;
  abonoex12: number | null;
  abonoex13: number | null;
  abonoex14: number | null;
}

export interface AspelResumenDto {
  num_Cta: string | null;
  nombre: string | null;
  ejercicio: number | null;
  saldoInicial: number | null;
  
  presup01: number | null;
  presup02: number | null;
  presup03: number | null;
  presup04: number | null;
  presup05: number | null;
  presup06: number | null;
  presup07: number | null;
  presup08: number | null;
  presup09: number | null;
  presup10: number | null;
  presup11: number | null;
  presup12: number | null;

  cargo01: number | null;
  cargo02: number | null;
  cargo03: number | null;
  cargo04: number | null;
  cargo05: number | null;
  cargo06: number | null;
  cargo07: number | null;
  cargo08: number | null;
  cargo09: number | null;
  cargo10: number | null;
  cargo11: number | null;
  cargo12: number | null;

  abono01: number | null;
  abono02: number | null;
  abono03: number | null;
  abono04: number | null;
  abono05: number | null;
  abono06: number | null;
  abono07: number | null;
  abono08: number | null;
  abono09: number | null;
  abono10: number | null;
  abono11: number | null;
  abono12: number | null;
}

export interface PresupuestoGastosDto {
  cta_Raiz?: string;
  cta_Papa?: string;
  nivel?: number;
  num_Cta?: string;
  nombre?: string;
  
  presup01?: number;
  presup02?: number;
  presup03?: number;
  presup04?: number;
  presup05?: number;
  presup06?: number;
  presup07?: number;
  presup08?: number;
  presup09?: number;
  presup10?: number;
  presup11?: number;
  presup12?: number;

  cargo01?: number;
  cargo02?: number;
  cargo03?: number;
  cargo04?: number;
  cargo05?: number;
  cargo06?: number;
  cargo07?: number;
  cargo08?: number;
  cargo09?: number;
  cargo10?: number;
  cargo11?: number;
  cargo12?: number;
}

export interface ReporteFinancieroDto {
  cta_Raiz: string;
  cta_Papa: string;
  num_Cta: string;
  nombre: string;
  nivel: number;
  inicial: number;
  cargo01: number;
  cargo02: number;
  cargo03: number;
  cargo04: number;
  cargo05: number;
  cargo06: number;
  cargo07: number;
  cargo08: number;
  cargo09: number;
  cargo10: number;
  cargo11: number;
  cargo12: number;
  abono01: number;
  abono02: number;
  abono03: number;
  abono04: number;
  abono05: number;
  abono06: number;
  abono07: number;
  abono08: number;
  abono09: number;
  abono10: number;
  abono11: number;
  abono12: number;
  /** Permite acceso dinámico tipado a cargo01-12 y abono01-12 sin necesidad de `as any` */
  [key: string]: number | string;
}

export interface AspelProveedorDto {
  id: string;
  databaseNumber: number;
  clave: string;
  nombre: string;
  rfc: string;
  status: string;
  diasCredito: number;
  limiteCredito: number;
}

export interface AspelCuentaPorPagarDto {
  id: string;
  databaseNumber: number;
  proveedorId: string;
  referencia: string;
  fechaEmision: string;
  fechaVencimiento: string;
  concepto: string;
  montoOriginal: number;
  saldoActual: number;
  estadoDocumento: string;
}

export interface AspelPagoProveedorDto {
  id: string;
  databaseNumber: number;
  proveedorId: string;
  referenciaFactura: string;
  fechaPago: string;
  montoPago: number;
  formaPago: string;
  referenciaPago: string;
}









