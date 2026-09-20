import { FormControl } from "@angular/forms";

export interface CustomerProviderFormGroup {
  id: FormControl<string | null>;
  customerId: FormControl<string | null>;
  providerId: FormControl<string | null>;
  providerName: FormControl<string | null>;
  categoryId: FormControl<number | null>;
  categoryName: FormControl<string | null>;
}
