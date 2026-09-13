export interface NominaDetalleDTO {
  id: string;
  nominaEncabezadoId: string;
  employeeId: string;
  numeroEmpleado: number;
  nombreCompleto: string;
  puesto: string;
  departamento: string;
  foto: string | null;

  diasDelPeriodo: number;
  diasTrabajados: number;
  diasAusentes: number;
  diasIncapacidad: number;
  diasVacaciones: number;
  diasPermisoConGoce: number;
  diasPermisoSinGoce: number;
  domingosTrabajados: number;

  sueldoBase: number;
  sueldoDiario: number;
  sueldoProporcional: number;
  tiempoExtraImporte: number;
  primaDominical: number;
  primaVacacional: number;
  compensacion: number;
  otrasPercepciones: number;
  totalPercepciones: number;

  descuentoAusencias: number;
  descuentoRetardos: number;
  descuentoPermisoSinGoce: number;
  cuotaImss: number;
  isr: number;
  descuentoPrestamos: number;
  otrasDeducciones: number;
  totalDeducciones: number;

  netoApagar: number;

  cuentaBancaria: string;
  clabeBancaria: string;
  nombreBanco: string;
  observaciones: string;
}

export interface NominaDetalleEditDTO {
  diasTrabajados: number;
  diasAusentes: number;
  diasIncapacidad: number;
  diasVacaciones: number;
  diasPermisoConGoce: number;
  diasPermisoSinGoce: number;
  domingosTrabajados: number;
  tiempoExtraImporte: number;
  compensacion: number;
  otrasPercepciones: number;
  cuotaImss: number;
  isr: number;
  otrasDeducciones: number;
  observaciones: string;
}
