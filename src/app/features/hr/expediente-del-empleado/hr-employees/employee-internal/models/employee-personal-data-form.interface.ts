import { FormControl } from "@angular/forms";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";

export interface IEmployeePersonalDataForm {
  birth: FormControl<Date | string>;
  bloodType: FormControl<number | null>;
  curp: FormControl<string>;
  localPhone: FormControl<string>;
  maritalStatus: FormControl<number | null>;
  nationality: FormControl<ISelectItem | null>;
  nss: FormControl<string>;
  rfc: FormControl<string>;
  sex: FormControl<number | null>;
}
