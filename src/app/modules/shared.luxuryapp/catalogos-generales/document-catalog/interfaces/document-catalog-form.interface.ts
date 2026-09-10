import { FormControl } from "@angular/forms";

export interface DocumentCatalogFormGroup {
  id: FormControl<string | null>;
  name: FormControl<string>;
  description: FormControl<string>;
  isMandatory: FormControl<boolean>;
  isActive: FormControl<boolean>;
}
