import { FormControl } from "@angular/forms";

export interface PaymentTypeFormGroup {
  id: FormControl<string | null>;
  codigo: FormControl<string>;
  descripcion: FormControl<string>;
  applicationUserId: FormControl<string | null>;
}
