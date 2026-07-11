import { FormControl } from "@angular/forms";

export interface SanctionTypeFormGroup {
  name: FormControl<string>;
  description: FormControl<string>;
  severityLevel: FormControl<number>;
  isTermination: FormControl<boolean>;
  requiresHRApproval: FormControl<boolean>;
  isActive: FormControl<boolean>;
}
