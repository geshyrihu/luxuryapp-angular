import { FormControl } from "@angular/forms";

export interface ProductCategoryFormGroup {
  id: FormControl<string | null>;
  nameCotegory: FormControl<string>;
  user: FormControl<string | null>;
}
