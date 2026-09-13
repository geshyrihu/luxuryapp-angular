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
  isActive: boolean;

  tipoJornada: number;
  tipoJornadaName: string;
  observaciones: string;
  diasDeTrabajo: DiaDeTrabajoDto[];
}

export interface WorkPositionScheduleAddOrEdit {
  name: string;
  isActive: boolean;

  tipoJornada: number;
  observaciones: string;
  diasDeTrabajo: DiaDeTrabajoDto[];
}
