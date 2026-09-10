import { FormControl } from "@angular/forms";

export interface TaskGroupCategoryFormGroup {
  id: FormControl<string | null>;
  name: FormControl<string>;
  description: FormControl<string>;
  departament: FormControl<number | null>;
  emoji: FormControl<string>;
  color: FormControl<string>;
}
