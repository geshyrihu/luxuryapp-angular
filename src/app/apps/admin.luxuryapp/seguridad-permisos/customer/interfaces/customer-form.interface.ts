import { FormControl } from "@angular/forms";

export interface CustomerFormGroup {
  id: FormControl<string | null>;
  active: FormControl<boolean | null>;
  nameCustomer: FormControl<string>;
  nombreCorto: FormControl<string>;
  numeroCliente: FormControl<string>;
  phoneOne: FormControl<string | null>;
  phoneTwo: FormControl<string | null>;
  photoPath: FormControl<string | File | null>;
  register: FormControl<Date | string>;
  rfc: FormControl<string>;
  folioPrefix: FormControl<string | null>;
  adreess: FormControl<string>;
  latitud: FormControl<string>;
  longitud: FormControl<string>;
}
