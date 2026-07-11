import { FormControl } from "@angular/forms";

export interface CfdiUseFormGroup {
  id: FormControl<string | null>;
  codigo: FormControl<string>;
  descripcion: FormControl<string>;
  employeeId: FormControl<string | null>;
}
