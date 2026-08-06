import { FormControl } from "@angular/forms";
import { FuenteReclutamiento } from "src/app/core/enums/fuente-reclutamiento";

export interface CandidateFormGroup {
  id: FormControl<string | null>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  phoneNumber: FormControl<string | null>;
  email: FormControl<string | null>;
  age: FormControl<number | null>;
  currentAddress: FormControl<string | null>;
  livesNearWorkplace: FormControl<boolean | null>;
  availability: FormControl<string | null>;
  salaryExpectation: FormControl<number | null>;
  experienceSummary: FormControl<string | null>;
  recruitmentSource: FormControl<FuenteReclutamiento | null>;
  generalComments: FormControl<string | null>;
}