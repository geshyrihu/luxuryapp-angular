import { DiaDeTrabajoDTO } from "./DiaDeTrabajoDTO";

export interface WorkPositionDetailDTO {
  id?: string;
  applicationRoleName: string;
  sueldo: number;
  sueldoBase: number;
  tipoJornada?: number | null;
  tipoJornadaName?: string;
  workPositionScheduleName?: string;
  workPositionScheduleDescription?: string;
  duracionCicloSemanas?: number | null;
  observaciones?: string;
  diasDeTrabajo?: DiaDeTrabajoDTO[];
  additionalInformation?: string;
}
