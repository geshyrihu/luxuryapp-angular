import { FormControl } from "@angular/forms";

export interface ModuleAppFormGroup {
  id: FormControl<string | null>;
  nameModule: FormControl<string>;
  rolLevel: FormControl<string | number | null>;
  label: FormControl<string | null>;
  routerLink: FormControl<string | null>;
  icon: FormControl<string | null>;
  pathParent: FormControl<string | null>;
  viewMobil: FormControl<boolean | null>;
}
