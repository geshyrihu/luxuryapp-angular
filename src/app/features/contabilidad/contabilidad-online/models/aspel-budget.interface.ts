// ── EPF (Estado de Posición Financiera) — DTO compacto ───────────────────────

/** Respuesta del endpoint balance-sheet/{customerId}/{year}/{mes} */
export interface IEpfDTO {
  nombreEmpresa: string;
  periodoPresupuesto: string;
  mesCorte: number;
  activo: IEpfCuentaDTO[];
  pasivo: IEpfCuentaDTO[];
  capital: IEpfCuentaDTO[];
  totalActivo: number;
  totalPasivo: number;
  totalCapital: number;
  totalPasivoCapital: number;
}

/** Cuenta individual del EPF con saldo al cierre del mes solicitado */
export interface IEpfCuentaDTO {
  numeroCuenta: string;
  descripcion: string;
  /** Saldo acumulado al cierre del mes. Siempre positivo para cuentas con saldo normal. */
  saldoCorte: number;
}

// ── Otros reportes financieros ────────────────────────────────────────────────

export interface IFinancialStatementDto {
  catalogo: string;
  idEmpresa: string;
  nombreEmpresa: string;
  periodoPresupuesto: string;
  clasificaciones: IClasificacionCuentasDto[];
  cuentasObsoletas: IObsoleteAccountDto[];
  cuentasFaltantes: ICuentaFaltanteDto[];
  /** Remanente acumulado del ejercicio por mes (índice 0=Enero…11=Dic). Replica @RAN de Aspel COI. */
  remanenteDelEjercicio: number[];
}

export interface ICuentaFaltanteDto {
  numeroCuenta: string;
  descripcion: string;
  clasificacion: string;
}

export interface IClasificacionCuentasDto {
  codigo: string;
  nombre: string;
  naturaleza: string;
  estadoFinanciero: string;
  cuentasMayor: ICuentaMayorDto[];
}

export interface IBaseAccountDto {
  numeroCuenta: string;
  descripcion: string;
  origenDatos: string;
  naturaleza: string;
  epf: boolean;
  er: boolean;
  cedP: boolean;
  fe: boolean;
  aCob: boolean;

  // Financial values
  montoEnero: number;
  montoFebrero: number;
  montoMarzo: number;
  montoAbril: number;
  montoMayo: number;
  montoJunio: number;
  montoJulio: number;
  montoAgosto: number;
  montoSeptiembre: number;
  montoOctubre: number;
  montoNoviembre: number;
  montoDiciembre: number;

  presupEnero: number;
  presupFebrero: number;
  presupMarzo: number;
  presupAbril: number;
  presupMayo: number;
  presupJunio: number;
  presupJulio: number;
  presupAgosto: number;
  presupSeptiembre: number;
  presupOctubre: number;
  presupNoviembre: number;
  presupDiciembre: number;

  acumuladoAnual: number;
  /** Saldo de apertura del ejercicio. Usado por el EPF para calcular el saldo acumulado al cierre de cada mes. */
  inicial: number;
}

export interface ICuentaMayorDto extends IBaseAccountDto {
  esCuentaMadre: boolean;
  subcuentas: ISubcuentaDto[];
}

export interface ISubcuentaDto extends IBaseAccountDto {
  cuentasDetalle: ICuentaDetalleDto[];
}

export type ICuentaDetalleDto = IBaseAccountDto;

export interface IObsoleteAccountDto {
  numeroCuenta: string;
  descripcion: string;
  naturaleza: string;
}

// ── Análisis de Cobranza ─────────────────────────────────────────────────────
export interface IAnalisisCobranzaDto {
  nombreEmpresa: string;
  periodo: string;
  totalCondominios: number;
  totalJudicial: number;
  totalMorosos: number;
  totalDeudaCorriente: number;
  totalAnticipos: number;
  totalDeuda: number;
  saldoBalanza: number;
  cobranzaJudicial: ICobranzaCondominoDto[];
  morosos: ICobranzaCondominoDto[];
  deudaCorriente: ICobranzaCondominoDto[];
  sinAdeudo: ICobranzaCondominoDto[];
  anticipos: ICobranzaCondominoDto[];
}

export interface ICobranzaCondominoDto {
  numeroCuenta: string;
  condomino: string;
  saldo: number;
  clasificacion: string;
}

export interface IFlujoCajaDto {
  nombreEmpresa: string;
  periodoPresupuesto: string;
  meses: IFlujoCajaMesDto[];
}

export interface IFlujoCajaMesDto {
  nombre: string;
  ingresos: number;
  gastos: number;
  flujoNeto: number;
  saldoAcumulado: number;
}










export type AspelBudgetDTO = IBaseAccountDto;

// ── Aspel Raw Data (Debug) ──────────────────────────────────────────────────

export interface IAspelDatosCombinadosDTO {
  cuentas: IAspelCuentaDTO[];
  saldos: IAspelSaldoDTO[];
  presupuestos: IAspelPresupuestoDTO[];
  polizasConDetalle: IAspelPolizaConDetalleDTO[];
}

export interface IAspelCuentaDTO {
  num_Cta: string;
  nombre: string;
  nivel: number;
  naturaleza: number;
  cta_Papa: string;
  status: string;
  tipo: string;
}

export interface IAspelSaldoDTO {
  num_Cta: string;
  ejercicio: number;
  inicial: number;
  cargo01: number;
  abono01: number;
  cargo02: number;
  abono02: number;
  cargo03: number;
  abono03: number;
  cargo04: number;
  abono04: number;
  cargo05: number;
  abono05: number;
  cargo06: number;
  abono06: number;
  cargo07: number;
  abono07: number;
  cargo08: number;
  abono08: number;
  cargo09: number;
  abono09: number;
  cargo10: number;
  abono10: number;
  cargo11: number;
  abono11: number;
  cargo12: number;
  abono12: number;
}

export interface IAspelPresupuestoDTO {
  num_Cta: string;
  ejercicio: number;
  presup01: number;
  presup02: number;
  presup03: number;
  presup04: number;
  presup05: number;
  presup06: number;
  presup07: number;
  presup08: number;
  presup09: number;
  presup10: number;
  presup11: number;
  presup12: number;
}

export interface IAspelPolizaConDetalleDTO {
  header: IAspelPolizaDTO;
  partidas: IAspelAuxiliarDTO[];
}

export interface IAspelPolizaDTO {
  tipo_Poli: string;
  num_Poliz: string;
  periodo: number;
  ejercicio: number;
  fecha_Pol: string;
  concep_Po: string;
}

export interface IAspelAuxiliarDTO {
  tipo_Poli: string;
  num_Poliz: string;
  num_Part: number;
  periodo: number;
  ejercicio: number;
  num_Cta: string;
  fecha_Pol: string;
  concep_Po: string;
  debe_Haber: string;
  montoMov: number;
}
