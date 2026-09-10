export interface IncidenciaNominaDTO {
  id: string;
  employeeId: string;
  nombreEmpleado: string;
  periodoNominaId: string;
  tipoIncidencia: number;
  tipoIncidenciaDisplay: string;
  fecha: string;
  diasAfectados: number;
  minutosRetardo: number;
  montoDescuento: number;
  vacationRequestId: string | null;
  leaveRequestId: string | null;
  incidentId: string | null;
  numeroFolioImss: string | null;
  tipoIncapacidad: number | null;
  tipoIncapacidadDisplay: string | null;
  porcentajePagoImss: number | null;
  observaciones: string;
  esSincronizada: boolean;
}

export interface IncidenciaNominaCreateDTO {
  employeeId: string;
  periodoNominaId: string;
  tipoIncidencia: number;
  fecha: string;
  diasAfectados: number;
  minutosRetardo: number;
  numeroFolioImss?: string;
  tipoIncapacidad?: number;
  porcentajePagoImss?: number;
  observaciones?: string;
}

export interface SincronizarIncidenciasDTO {
  periodoNominaId: string;
  customerId: string;
}

export const TIPO_INCIDENCIA_OPTIONS = [
  { label: "Falta Injustificada",  value: 0 },
  { label: "Retardo Menor",        value: 1 },
  { label: "Retardo Mayor",        value: 2 },
  { label: "Incapacidad",          value: 3 },
  { label: "Vacacion Pagada",      value: 4 },
  { label: "Permiso Con Goce",     value: 5 },
  { label: "Permiso Sin Goce",     value: 6 },
  { label: "Dia Economico",        value: 7 },
  { label: "Otro Descuento",       value: 8 },
];

export const TIPO_INCAPACIDAD_OPTIONS = [
  { label: "Enfermedad General",  value: 0 },
  { label: "Maternidad",          value: 1 },
  { label: "Riesgo de Trabajo",   value: 2 },
];
