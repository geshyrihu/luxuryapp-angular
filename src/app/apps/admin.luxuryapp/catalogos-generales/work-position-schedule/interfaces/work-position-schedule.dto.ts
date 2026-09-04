export interface DiaDeTrabajoDto {
  diaSemana: number;
  numeroSemanaCiclo: number;
  horaEntrada: string | null;
  horaSalida: string | null;
  esDescanso: boolean;
}

export interface WorkPositionScheduleDto {
  id: string;
  name: string;
  description: string;
  isActive: boolean;

  // Modelo normalizado
  tipoJornada: number;
  tipoJornadaName: string;
  duracionCicloSemanas: number;
  observaciones: string;
  diasDeTrabajo: DiaDeTrabajoDto[];

  // [LEGACY] Mantener lectura hasta migrar el formulario de edicion
  // (el backend los sigue devolviendo derivados de la semana 1).
  turnoTrabajo: number;
  turnoTrabajoName: string;
  lunesEntrada: string | null;
  lunesSalida: string | null;
  martesEntrada: string | null;
  martesSalida: string | null;
  miercolesEntrada: string | null;
  miercolesSalida: string | null;
  juevesEntrada: string | null;
  juevesSalida: string | null;
  viernesEntrada: string | null;
  viernesSalida: string | null;
  sabadoEntrada: string | null;
  sabadoSalida: string | null;
  domingoEntrada: string | null;
  domingoSalida: string | null;
  observationsWorkShift: string;
}

export interface WorkPositionScheduleAddOrEdit {
  name: string;
  description: string;
  isActive: boolean;

  // Modelo normalizado
  tipoJornada: number;
  duracionCicloSemanas: number;
  observaciones: string;
  diasDeTrabajo: DiaDeTrabajoDto[];

  // [LEGACY] Mantener campos en el payload para no romper el form actual.
  // El backend los ignora y deriva de diasDeTrabajo.
  turnoTrabajo: number;
  lunesEntrada: string | null;
  lunesSalida: string | null;
  martesEntrada: string | null;
  martesSalida: string | null;
  miercolesEntrada: string | null;
  miercolesSalida: string | null;
  juevesEntrada: string | null;
  juevesSalida: string | null;
  viernesEntrada: string | null;
  viernesSalida: string | null;
  sabadoEntrada: string | null;
  sabadoSalida: string | null;
  domingoEntrada: string | null;
  domingoSalida: string | null;
  observationsWorkShift: string;
}
