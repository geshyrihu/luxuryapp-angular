import { FormControl } from "@angular/forms";

export interface MeterCategoryFormGroup {
  id: FormControl<string | null>;
  nombreMedidorCategoria: FormControl<string>;
}
