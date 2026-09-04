import { FormArray, FormControl, FormGroup } from "@angular/forms";

export interface DiaDeTrabajoControls {
  diaSemana: FormControl<number>;
  numeroSemanaCiclo: FormControl<number>;
  horaEntrada: FormControl<string | null>;
  horaSalida: FormControl<string | null>;
  esDescanso: FormControl<boolean>;
}

export type DiaDeTrabajoFormGroup = FormGroup<DiaDeTrabajoControls>;

export interface WorkPositionScheduleControls {
  id: FormControl<string | null>;
  name: FormControl<string>;
  description: FormControl<string>;
  isActive: FormControl<boolean>;

  // Modelo normalizado
  tipoJornada: FormControl<number>;
  duracionCicloSemanas: FormControl<number>;
  observaciones: FormControl<string>;
  diasDeTrabajo: FormArray<DiaDeTrabajoFormGroup>;

  // [LEGACY] Mantener hasta migrar el form de edicion.
  turnoTrabajo: FormControl<number>;
  lunesEntrada: FormControl<string | null>;
  lunesSalida: FormControl<string | null>;
  martesEntrada: FormControl<string | null>;
  martesSalida: FormControl<string | null>;
  miercolesEntrada: FormControl<string | null>;
  miercolesSalida: FormControl<string | null>;
  juevesEntrada: FormControl<string | null>;
  juevesSalida: FormControl<string | null>;
  viernesEntrada: FormControl<string | null>;
  viernesSalida: FormControl<string | null>;
  sabadoEntrada: FormControl<string | null>;
  sabadoSalida: FormControl<string | null>;
  domingoEntrada: FormControl<string | null>;
  domingoSalida: FormControl<string | null>;
  observationsWorkShift: FormControl<string>;
}

export type WorkPositionScheduleFormGroup = FormGroup<WorkPositionScheduleControls>;
