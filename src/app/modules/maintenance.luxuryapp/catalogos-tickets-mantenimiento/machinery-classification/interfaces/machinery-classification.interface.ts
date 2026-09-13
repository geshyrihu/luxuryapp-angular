import { FormControl } from "@angular/forms";

export interface MachineryClassificationFormGroup {
  id: FormControl<string | null>;
  descripcion: FormControl<string>;
}
