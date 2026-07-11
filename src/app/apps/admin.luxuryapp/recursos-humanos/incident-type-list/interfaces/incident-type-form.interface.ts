import { FormControl } from "@angular/forms";

export interface IncidentTypeFormGroup {
  name: FormControl<string>;
  description: FormControl<string>;
  category: FormControl<number>;
  defaultSeverity: FormControl<number>;
  isActive: FormControl<boolean>;
}
