import { FormGroup } from '@angular/forms';
import { CustomerLocationAddOrEditDTO } from './customer-location-add-or-edit.dto';

export interface CustomerLocationForm extends FormGroup<{
  id: FormGroup<{
    value: string | null;
  }>;
  customerId: FormGroup<{
    value: string | null;
  }>;
  name: FormGroup<{
    value: string | null;
  }>;
  locationType: FormGroup<{
    value: string | null;
  }>;
  phoneOne: FormGroup<{
    value: string | null;
  }>;
  phoneTwo: FormGroup<{
    value: string | null;
  }>;
  contactName: FormGroup<{
    value: string | null;
  }>;
  notes: FormGroup<{
    value: string | null;
  }>;
  sortOrder: FormGroup<{
    value: number | null;
  }>;
  isActive: FormGroup<{
    value: boolean | null;
  }>;
}> {
  value: CustomerLocationAddOrEditDTO;
  rawValue: CustomerLocationAddOrEditDTO;
}