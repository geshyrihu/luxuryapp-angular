export interface NominaEncabezadoDTO {
  id: string;
  periodoNominaId: string;
  periodoDescripcion: string;
  customerId: string;
  nombreCliente: string;
  estado: string;
  estadoValue: number;
  totalPercepciones: number;
  totalDeducciones: number;
  totalNeto: number;
  totalEmpleados: number;
  fechaAprobacion: string | null;
  aprobadoPor: string | null;
  fechaCierre: string | null;
  cerradoPor: string | null;
  observaciones: string;
}

export interface GenerarNominaDTO {
  periodoNominaId: string;
  customerId: string;
  soloEmpleadosActivos: boolean;
  incluirTiempoExtra: boolean;
  sincronizarIncidencias: boolean;
}

export interface NominaResumenDTO {
  nominaId: string;
  periodoDescripcion: string;
  totalEmpleados: number;
  totalPercepciones: number;
  totalDeducciones: number;
  totalNeto: number;
  promedioNeto: number;
  empleadoMayorNeto: string;
  empleadoMenorNeto: string;
}
