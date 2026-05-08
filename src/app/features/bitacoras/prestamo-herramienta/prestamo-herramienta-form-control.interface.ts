import { FormControl } from "@angular/forms";

export interface IPrestamoHerramientaForm {
  id: FormControl<string | null>;
  customerId: FormControl<string>;
  fechaSalida: FormControl<string>;
  fechaRegreso: FormControl<string | null>;
  applicationUserId: FormControl<string>;
  applicationUser: FormControl<any>;
  toolId: FormControl<number | string>;
  tool: FormControl<any>;
  observaciones: FormControl<string | null>;
  applicationUserResponsableId: FormControl<string>;
}









