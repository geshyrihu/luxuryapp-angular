import { FormControl } from "@angular/forms";

export interface CandidateFormGroup {
  id: FormControl<string | null>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  phoneNumber: FormControl<string | null>;
  email: FormControl<string | null>;
  birthDate: FormControl<string | null>;
  recruitmentSource: FormControl<number | null>;
  currentAddress: FormControl<string | null>;
  availability: FormControl<string | null>;
  salaryExpectation: FormControl<number | null>;
  experienceSummary: FormControl<string | null>;
  generalComments: FormControl<string | null>;
}
