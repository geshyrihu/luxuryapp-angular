import { FormControl } from "@angular/forms";

export interface IFundingForm {
  id: FormControl<string | null>;
  period: FormControl<string | null>;
  customerId: FormControl<string>;
}









