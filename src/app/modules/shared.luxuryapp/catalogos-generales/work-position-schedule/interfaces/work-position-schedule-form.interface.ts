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

  tipoJornada: FormControl<number>;
  duracionCicloSemanas: FormControl<number>;
  observaciones: FormControl<string>;
  diasDeTrabajo: FormArray<DiaDeTrabajoFormGroup>;
}

export type WorkPositionScheduleFormGroup = FormGroup<WorkPositionScheduleControls>;
