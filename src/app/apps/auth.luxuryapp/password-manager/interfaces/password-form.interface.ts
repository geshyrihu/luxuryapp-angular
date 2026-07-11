import { FormControl } from "@angular/forms";

export interface CredentialFormGroup {
  platformName: FormControl<string>;
  username: FormControl<string>;
  password: FormControl<string>;
  subscriptionExpirationDate: FormControl<string | null>;
}
