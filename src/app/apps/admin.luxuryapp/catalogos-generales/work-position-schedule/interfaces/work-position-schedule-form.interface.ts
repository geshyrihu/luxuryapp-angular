import { FormControl } from "@angular/forms";

export interface WorkPositionScheduleFormGroup {
  id: FormControl<string | null>;
  name: FormControl<string>;
  description: FormControl<string>;
  isActive: FormControl<boolean>;
  turnoTrabajo: FormControl<number>;
  tipoTurnoEspecial: FormControl<string>;
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
