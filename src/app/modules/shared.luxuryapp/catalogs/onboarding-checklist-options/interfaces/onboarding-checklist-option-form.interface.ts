import { FormControl } from "@angular/forms";

export interface OnboardingChecklistOptionFormGroup {
  id: FormControl<string | null>;
  name: FormControl<string>;
  description: FormControl<string>;
  isActive: FormControl<boolean>;
  diasSla: FormControl<number>;
  roles: FormControl<Array<number | string>>;
}
