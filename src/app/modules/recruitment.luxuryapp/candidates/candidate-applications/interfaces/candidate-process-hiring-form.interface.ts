import { FormControl } from "@angular/forms";

export interface CandidateProcessHiringFormGroup {
  firstName: FormControl<string>;
  email: FormControl<string>;
  lastName: FormControl<string>;
  birthDate: FormControl<string | null>;
  phoneNumber: FormControl<string>;
  street: FormControl<string>;
  neighborhood: FormControl<string>;
  municipality: FormControl<string>;
  postalCode: FormControl<string>;
  state: FormControl<string>;
}
