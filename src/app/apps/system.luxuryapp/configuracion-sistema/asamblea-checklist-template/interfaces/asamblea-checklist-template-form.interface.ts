import { FormControl } from "@angular/forms";

export interface AsambleaChecklistTemplateFormGroup {
  id: FormControl<string | null>;
  code: FormControl<string>;
  title: FormControl<string>;
  category: FormControl<string>;
  description: FormControl<string>;
  offsetDaysFromMeeting: FormControl<number>;
  defaultResponsibleRole: FormControl<string>;
  isMandatory: FormControl<boolean>;
  isActive: FormControl<boolean>;
  sortOrder: FormControl<number>;
}
