import { FormControl } from "@angular/forms";

export interface CatalogoActivoFormGroup {
  id: FormControl<string>;
  folio: FormControl<string>;
  name: FormControl<string>;
  assetCategory: FormControl<number | null>;
}
