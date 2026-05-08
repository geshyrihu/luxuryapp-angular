import { FormControl } from "@angular/forms";

export interface IMantenimientoPreventivoForm {
  id: FormControl<string | null>;
  activity: FormControl<string>;
  machineryId: FormControl<number | string>;
  month: FormControl<number | null>;
  observation: FormControl<string>;
  price: FormControl<number | null>;
  providerId: FormControl<number | string>;
  recurrence: FormControl<number | null>;
  typeMaintance: FormControl<number | null>;
  customerId: FormControl<string>;
  accountingCatalogId: FormControl<number | string>;
  machineryName: FormControl<any>;
  providerName: FormControl<any>;
  accountingCatalogName: FormControl<any>;
  applicationUserId: FormControl<string>;
}









