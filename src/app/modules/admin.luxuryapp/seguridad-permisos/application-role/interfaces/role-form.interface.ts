import { FormControl } from "@angular/forms";

export interface RoleFormGroup {
  id: FormControl<string | null>;
  name: FormControl<string>;
  displayName: FormControl<string>;
  roleType: FormControl<number>;
  departament: FormControl<number>;
  sortOrder: FormControl<number>;
  isActive: FormControl<boolean>;
}
