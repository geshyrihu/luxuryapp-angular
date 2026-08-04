export interface AspelBudgetDTO {
  ID_Empresa?: string;
  Nombre_Empresa?: string;
  ID_Periodo_presupuesto?: string;
  Periodo_Presupuesto?: string;
  Cuentas?: CuentaAspelTercerNivelDTO[];
  idEmpresa?: string;
  nombreEmpresa?: string;
  idPeriodoPresupuesto?: string;
  periodoPresupuesto?: string;
  cuentas?: CuentaAspelTercerNivelDTO[];
  cuentasDetalladas?: CuentaAspelTercerNivelDTO[];

  totalEneroMonto: number;
  totalEneroPresupuesto: number;
  totalFebreroMonto: number;
  totalFebreroPresupuesto: number;
  totalMarzoMonto: number;
  totalMarzoPresupuesto: number;
  totalAbrilMonto: number;
  totalAbrilPresupuesto: number;
  totalMayoMonto: number;
  totalMayoPresupuesto: number;
  totalJunioMonto: number;
  totalJunioPresupuesto: number;
  totalJulioMonto: number;
  totalJulioPresupuesto: number;
  totalAgostoMonto: number;
  totalAgostoPresupuesto: number;
  totalSeptiembreMonto: number;
  totalSeptiembrePresupuesto: number;
  totalOctubreMonto: number;
  totalOctubrePresupuesto: number;
  totalNoviembreMonto: number;
  totalNoviembrePresupuesto: number;
  totalDiciembreMonto: number;
  totalDiciembrePresupuesto: number;

  sumaAnualAcumuladoMontoOriginal: number;
  sumaAnualAcumuladoPresupuestoOriginal: number;
  sumaAnualAcumuladoMontoCalculado: number;
  sumaPresupuestoAnualCalculado: number;
  sumaPresupuestoRestanteCalculado: number;
}

export interface CuentaAspelTercerNivelDTO {
  Codigo_Cuenta?: string;
  Descripcion_Cuenta?: string;
  Nivel_Cuenta?: number;
  Cuenta_Padre?: string;
  codigo_Cuenta?: string;
  descripcion_Cuenta?: string;
  nivel_Cuenta?: number;
  cuenta_Padre?: string;
  esFilaAgrupadora?: boolean;
  codigoCuenta?: string;
  descripcionCuenta?: string;
  nivelCuenta?: number;
  cuentaPadre?: string;

  Monto_Enero?: number;
  Presup_Enero?: number;
  Monto_Febrero?: number;
  Presup_Febrero?: number;
  Monto_Marzo?: number;
  Presup_Marzo?: number;
  Monto_Abril?: number;
  Presup_Abril?: number;
  Monto_Mayo?: number;
  Presup_Mayo?: number;
  Monto_Junio?: number;
  Presup_Junio?: number;
  Monto_Julio?: number;
  Presup_Julio?: number;
  Monto_Agosto?: number;
  Presup_Agosto?: number;
  Monto_Septiembre?: number;
  Presup_Septiembre?: number;
  Monto_Octubre?: number;
  Presup_Octubre?: number;
  Monto_Noviembre?: number;
  Presup_Noviembre?: number;
  Monto_Diciembre?: number;
  Presup_Diciembre?: number;
  monto_Enero?: number;
  presup_Enero?: number;
  monto_Febrero?: number;
  presup_Febrero?: number;
  monto_Marzo?: number;
  presup_Marzo?: number;
  monto_Abril?: number;
  presup_Abril?: number;
  monto_Mayo?: number;
  presup_Mayo?: number;
  monto_Junio?: number;
  presup_Junio?: number;
  monto_Julio?: number;
  presup_Julio?: number;
  monto_Agosto?: number;
  presup_Agosto?: number;
  monto_Septiembre?: number;
  presup_Septiembre?: number;
  monto_Octubre?: number;
  presup_Octubre?: number;
  monto_Noviembre?: number;
  presup_Noviembre?: number;
  monto_Diciembre?: number;
  presup_Diciembre?: number;
  eneroMonto?: number;
  eneroPresupuesto?: number;
  febreroMonto?: number;
  febreroPresupuesto?: number;
  marzoMonto?: number;
  marzoPresupuesto?: number;
  abrilMonto?: number;
  abrilPresupuesto?: number;
  mayoMonto?: number;
  mayoPresupuesto?: number;
  junioMonto?: number;
  junioPresupuesto?: number;
  julioMonto?: number;
  julioPresupuesto?: number;
  agostoMonto?: number;
  agostoPresupuesto?: number;
  septiembreMonto?: number;
  septiembrePresupuesto?: number;
  octubreMonto?: number;
  octubrePresupuesto?: number;
  noviembreMonto?: number;
  noviembrePresupuesto?: number;
  diciembreMonto?: number;
  diciembrePresupuesto?: number;

  Acumulado_Anual?: number;
  acumulado_Anual?: number;
  anualAcumulado?: number;
  anualAcumuladoPresupuesto?: number;
  anualAcumuladoMontoPresupuesto?: number;

  presupuestoAnual?: number;
  presupuestoRestante?: number;
}









