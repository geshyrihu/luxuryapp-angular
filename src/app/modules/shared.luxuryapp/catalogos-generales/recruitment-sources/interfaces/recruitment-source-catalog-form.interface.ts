import { FormControl } from "@angular/forms";

export interface RecruitmentSourceCatalogFormGroup {
  id: FormControl<string | null>;
  name: FormControl<string>;
  isActive: FormControl<boolean>;
}