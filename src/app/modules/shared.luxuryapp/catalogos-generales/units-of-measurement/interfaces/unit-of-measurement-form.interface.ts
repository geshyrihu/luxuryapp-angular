import { FormControl } from "@angular/forms";

export interface UnitOfMeasurementFormGroup {
  id: FormControl<string | null>;
  descripcion: FormControl<string>;
}
