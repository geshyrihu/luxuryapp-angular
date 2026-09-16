import { WorkDayForm } from './work-position-schedule-form.model';

export interface WorkPositionScheduleDto {
  id: string;
  name: string;
  isActive: boolean;
  tipoJornada: number;
  observaciones: string;
  diasDeTrabajo: WorkDayForm[];
}
