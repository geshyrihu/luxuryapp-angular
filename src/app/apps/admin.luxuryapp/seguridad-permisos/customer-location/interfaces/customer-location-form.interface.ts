import { FormControl, FormGroup } from '@angular/forms';
import { CustomerLocationAddOrEditDto } from './customer-location-add-or-edit.dto';

export interface CustomerLocationForm extends FormGroup<{
  id: FormControl<string | null>;
  customerId: FormControl<string | null>;
  name: FormControl<string | null>;
  locationType: FormControl<string | null>;
  phoneOne: FormControl<string | null>;
  phoneTwo: FormControl<string | null>;
  contactName: FormControl<string | null>;
  notes: FormControl<string | null>;
  sortOrder: FormControl<number | null>;
  isActive: FormControl<boolean | null>;
}> {
  value: Partial<CustomerLocationAddOrEditDto>;
  rawValue: CustomerLocationAddOrEditDto;
}
