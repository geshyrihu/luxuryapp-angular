import { FormControl } from "@angular/forms";

export interface IEmployeeLaboralDataForm {
  dateAdmission: FormControl<Date | string | null>;
  customerId: FormControl<string | null>;
  active: FormControl<boolean | null>;
  typePerson: FormControl<number | null>;
  salary: FormControl<number | null>;
  dailySalary: FormControl<number | null>;
  educationLevel: FormControl<number | null>;
  applicationUserId: FormControl<string | null>;
  numberEmployee: FormControl<number | null>;
}
