import { FormControl } from "@angular/forms";

export interface IAgendaSupervisionForm {
  id: FormControl<string | null>;
  fechaSolicitud: FormControl<Date | string | null>;
  customerId: FormControl<string | null>;
  problema: FormControl<string>;
  solucion: FormControl<string>;
  fechaConclusion: FormControl<Date | string | null>;
  applicationUserId: FormControl<string | null>;
}









