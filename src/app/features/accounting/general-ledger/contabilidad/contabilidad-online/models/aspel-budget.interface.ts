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

export interface ICedulaExtraordinariaDto {
  nombreEmpresa: string;
  periodoPresupuesto: string;
  recaudadoMejoras: ICuentaMayorDto[];
  totalRecaudadoMejoras: ICuentaMayorDto;
  gastosMejoras: ICuentaMayorDto[];
  totalGastosMejoras: ICuentaMayorDto;
  gastosExtraordinarios: ICuentaMayorDto[];
  totalGastosExtraordinarios: ICuentaMayorDto;
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

export interface ICobranzaOnlineSyncMetadataDto {
  lastSyncAt: string | null;
  syncStatus: string;
  dataSource: string;
  isFallback: boolean;
  syncMessage: string;
  lastError: string | null;
  lastErrorAt: string | null;
}

export interface ICobranzaOnlineAnalysisCondominoDetalleDto {
  cuenta: string;
  concepto: string;
  saldoAnterior: number;
  cargosMes: number;
  abonosMes: number;
  saldoFinal: number;
}

export interface ICobranzaOnlineAnalysisCondominoDto {
  numeroCuenta: string;
  condomino: string;
  saldoAnterior: number;
  cargosMes: number;
  abonosMes: number;
  saldo: number;
  clasificacion: string;
  desglose: ICobranzaOnlineAnalysisCondominoDetalleDto[];
}

export interface IAnalisisCobranzaOnlineDto {
  customerId: string;
  year: number;
  month: number;
  day: number;
  periodo: string;
  cutoffDate: string;
  dataSource: string;
  totalCondominios: number;
  cuotaMttoVigente: number;
  cuotaExtraordinariaVigente: number;
  cuotaMensualTotal: number;
  cobranzaPerfecta: number;
  totalJudicial: number;
  totalMorosos: number;
  totalDeudaCorriente: number;
  totalSinAdeudo: number;
  totalAnticipos: number;
  totalDeuda: number;
  totalSaldoAnterior: number;
  totalCargosMes: number;
  totalAbonosMes: number;
  totalCobrado: number;
  saldoBalanza: number;
  syncMetadata: ICobranzaOnlineSyncMetadataDto;
  cobranzaJudicial: ICobranzaOnlineAnalysisCondominoDto[];
  morosos: ICobranzaOnlineAnalysisCondominoDto[];
  deudaCorriente: ICobranzaOnlineAnalysisCondominoDto[];
  sinAdeudo: ICobranzaOnlineAnalysisCondominoDto[];
  anticipos: ICobranzaOnlineAnalysisCondominoDto[];
}

export interface IFlujoCajaDto {
  nombreEmpresa: string;
  periodoPresupuesto: string;
  columnas: string[];
  grupos: IFlujoCajaGrupoDto[];
}

export interface IFlujoCajaGrupoDto {
  nombre: string;
  filas: IFlujoCajaFilaDto[];
  filaTotales?: IFlujoCajaFilaDto;
}

export interface IFlujoCajaFilaDto {
  concepto: string;
  signo: string;
  montos: number[];
  montosMtto: number[];
  montosObrasMejoras: number[];
  montosFondoReserva: number[];
  esSuma: boolean;
  esResta: boolean;
  esFilaTotal: boolean;
  esEncabezado: boolean;
  ocultarOrigen: boolean;
  esManual: boolean;
  origen: string;
}

export interface IReporteFinancieroDto {
  nombreEmpresa: string;
  periodoPresupuesto: string;
  meses: string[];
  ingresos: IReporteFinancieroFilaDto[];
  totalIngresos: number[];
  gastosGenerales: IReporteFinancieroFilaDto[];
  totalGastos: number[];
  subtotal: number[];
  otrosIngresos: IReporteFinancieroFilaDto[];
  otrosGastos: IReporteFinancieroFilaDto[];
  sumaOtros: number[];
  resultadoPeriodo: number[];
  fondoMejoras: IReporteFinancieroFondoDto;
}

export interface IReporteFinancieroFilaDto {
  numeroCuenta: string;
  concepto: string;
  valores: number[];
}

export interface IReporteFinancieroFondoDto {
  ingresoAmenidades: IReporteFinancieroFilaDto;
  gastosAmenidades: IReporteFinancieroFilaDto[];
  gastosMejoras: IReporteFinancieroFilaDto[];
  remanenteMejoras: number[];
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

// ── Bancos e Inversiones ──────────────────────────────────────────────────────

export interface IBancosInversionesDto {
  nombreEmpresa: string;
  fechaReporte: string;
  bancos: IBancoRowDto[];
  sumaBancos: number;
  inversionesOrdinarias: IInversionRowDto[];
  subtotalInversiones: number;
  fondoReserva?: IInversionRowDto;
  sumaInversiones: number;
}

export interface IBancoRowDto {
  cuenta: string;
  importe: number;
}

export interface IInversionRowDto {
  cuenta: string;
  importe: number;
  descripcion: string;
}

export interface IFondoReservaDTO {
  nombreEmpresa: string;
  fechaReporte: string;
  disponibleInicial: number;
  intereses: number;
  disponibleTeorico: number;
  cuentaBancaria: string;
  disponibleReal: number;
}

export interface IProyectosAprobadosDTO {
  idEmpresa: string;
  empresa: string;
  periodo: string;
  totalGeneral?: IProyectoAprobadoRowDTO;
  proyectos: IProyectoAprobadoRowDTO[];
}

export interface IProyectoAprobadoRowDTO {
  numeroCuenta: string;
  descripcion: string;
  saldoInicial: number;
  presupuestoMensual: number;
  presupuestoAnual: number;
  ejecutadoAnual: number;
  porcentajeAvance: number;
  totalACobrar: number;
  totalCobrado: number;
  saldoRestante: number;
  meses: IProyectoMesDTO[];
}

export interface IProyectoMesDTO {
  mes: number;
  presupuesto: number;
  cargo: number;
}

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

