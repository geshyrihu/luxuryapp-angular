import { FormControl } from "@angular/forms";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";

export interface IEmployeePersonalDataForm {
  birth: FormControl<Date | string>;
  bloodType: FormControl<number | null>;
  curp: FormControl<string>;
  localPhone: FormControl<string>;
  maritalStatus: FormControl<number | null>;
  nationality: FormControl<SelectItemDto | null>;
  nss: FormControl<string>;
  rfc: FormControl<string>;
  sex: FormControl<number | null>;
}
