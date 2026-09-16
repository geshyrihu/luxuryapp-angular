export interface WorkDayForm {
  id?: string;
  diaSemana: number;
  numeroSemanaCiclo: number;
  horaEntrada: string | null;
  horaSalida: string | null;
  esDescanso: boolean;
}

export interface WorkPositionScheduleForm {
  id?: string;
  name: string;
  isActive: boolean;
  tipoJornada: number;
  observaciones: string;
  diasDeTrabajo: WorkDayForm[];
}
