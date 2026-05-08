import { FormControl } from "@angular/forms";

export interface IPolicyContractForm {
  id: FormControl<string | null>;
  providerId: FormControl<string>;
  typeOfContract: FormControl<number | string>;
  isCurrent: FormControl<boolean>;
  providerName: FormControl<string | null>;
  customerId: FormControl<string>;
  description: FormControl<string>;
  startDate: FormControl<string>;
  endDate: FormControl<string | null>;
  endDateIndefinite: FormControl<boolean>;
  document: FormControl<any>;
}









