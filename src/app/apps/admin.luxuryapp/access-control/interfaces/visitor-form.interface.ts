export interface VisitorFormGroup {
  fullName: import("@angular/forms").FormControl<string>;
  email: import("@angular/forms").FormControl<string | null>;
  phone: import("@angular/forms").FormControl<string | null>;
  company: import("@angular/forms").FormControl<string | null>;
  vehiclePlate: import("@angular/forms").FormControl<string | null>;
  documentId: import("@angular/forms").FormControl<string | null>;
  isBlacklisted: import("@angular/forms").FormControl<boolean>;
  blacklistReason: import("@angular/forms").FormControl<string | null>;
}
