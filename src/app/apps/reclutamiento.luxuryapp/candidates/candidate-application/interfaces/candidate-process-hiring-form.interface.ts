import { FormControl } from "@angular/forms";

export interface CandidateProcessHiringFormGroup {
  executionDate: FormControl<string | null>;
  firstName: FormControl<string>;
  paternalLastName: FormControl<string>;
  maternalLastName: FormControl<string>;
  birthDate: FormControl<string | null>;
  nss: FormControl<string>;
  rfc: FormControl<string>;
  curp: FormControl<string>;
  street: FormControl<string>;
  neighborhood: FormControl<string>;
  municipality: FormControl<string>;
  postalCode: FormControl<string>;
  state: FormControl<string>;
  phoneNumber: FormControl<string>;
  typeContractRegister: FormControl<number | null>;
  bankName: FormControl<string>;
  accountNumber: FormControl<string>;
  clabe: FormControl<string>;
  beneficiaryName: FormControl<string>;
  beneficiaryPhoneNumber: FormControl<string>;
  beneficiaryRelation: FormControl<number | null>;
  emergencyContactName: FormControl<string>;
  emergencyContactPhoneNumber: FormControl<string>;
  emergencyContactRelation: FormControl<number | null>;
  hasControlledMedication: FormControl<boolean>;
  controlledMedicationDetails: FormControl<string>;
  hasMedicationAllergies: FormControl<boolean>;
  medicationAllergiesDetails: FormControl<string>;
  hasChronicDiseases: FormControl<boolean>;
  chronicDiseasesDetails: FormControl<string>;
  boss: FormControl<string>;
  customerAddress: FormControl<string>;
  workShift: FormControl<number | null>;
  recruitmentSource: FormControl<number | null>;
  additionalInformation: FormControl<string>;
}
