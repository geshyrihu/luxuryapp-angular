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

  tipoJornada: number;
  tipoJornadaName: string;
  duracionCicloSemanas: number;
  observaciones: string;
  diasDeTrabajo: DiaDeTrabajoDto[];
}

export interface WorkPositionScheduleAddOrEdit {
  name: string;
  description: string;
  isActive: boolean;

  tipoJornada: number;
  duracionCicloSemanas: number;
  observaciones: string;
  diasDeTrabajo: DiaDeTrabajoDto[];
}
