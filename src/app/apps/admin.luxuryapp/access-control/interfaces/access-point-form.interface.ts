export interface AccessPointFormGroup {
  name: import("@angular/forms").FormControl<string>;
  accessPointType: import("@angular/forms").FormControl<string>;
  location: import("@angular/forms").FormControl<string | null>;
  isActive: import("@angular/forms").FormControl<boolean>;
}
