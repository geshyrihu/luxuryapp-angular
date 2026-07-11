import { FormControl } from "@angular/forms";

export interface PaymentMethodFormGroup {
  id: FormControl<string | null>;
  codigo: FormControl<string>;
  descripcion: FormControl<string>;
  applicationUserId: FormControl<string | null>;
}
