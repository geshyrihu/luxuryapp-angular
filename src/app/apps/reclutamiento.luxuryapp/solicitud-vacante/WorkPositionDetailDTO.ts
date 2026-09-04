import { DiaDeTrabajoDTO } from "./DiaDeTrabajoDTO";

export interface WorkPositionDetailDTO {
  id?: string;
  applicationRoleName: string;
  sueldo: number;
  sueldoBase: number;
  turnoTrabajo?: number | null;
  tipoJornada?: number | null;
  tipoJornadaName?: string;
  workPositionScheduleName?: string;
  workPositionScheduleDescription?: string;
  duracionCicloSemanas?: number | null;
  observaciones?: string;
  diasDeTrabajo?: DiaDeTrabajoDTO[];
  lunesEntrada?: string;
  lunesSalida?: string;
  martesEntrada?: string;
  martesSalida?: string;
  miercolesEntrada?: string;
  miercolesSalida?: string;
  juevesEntrada?: string;
  juevesSalida?: string;
  viernesEntrada?: string;
  viernesSalida?: string;
  sabadoEntrada?: string;
  sabadoSalida?: string;
  domingoEntrada?: string;
  domingoSalida?: string;
  observationsWorkShift?: string;
  additionalInformation?: string;
}
