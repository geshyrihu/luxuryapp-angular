export interface WorkPositionScheduleDto {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  turnoTrabajo: number;
  turnoTrabajoName: string;
  tipoTurnoEspecial: string;
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
  turnoTrabajo: number;
  tipoTurnoEspecial: string;
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
