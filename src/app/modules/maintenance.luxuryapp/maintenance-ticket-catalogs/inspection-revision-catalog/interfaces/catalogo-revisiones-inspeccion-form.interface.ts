import { FormControl } from "@angular/forms";

export interface CatalogoRevisionesInspeccionFormGroup {
  id: FormControl<string>;
  description: FormControl<string>;
  departament: FormControl<number>;
  equipoClasificacionId: FormControl<string>;
}
