import { FormControl } from "@angular/forms";

export interface BankFormGroup {
  id: FormControl<string | null>;
  code: FormControl<string>;
  shortName: FormControl<string>;
  largeName: FormControl<string>;
}
