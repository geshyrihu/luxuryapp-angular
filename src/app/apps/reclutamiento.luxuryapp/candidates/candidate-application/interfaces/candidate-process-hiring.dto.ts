import { CandidateApplicationStage } from "src/app/core/enums/candidate-application-stage";

export interface CandidateProcessHiringDto {
  executionDate: string;
  firstName: string;
  paternalLastName: string;
  maternalLastName: string;
  birthDate: string;
  nss: string;
  rfc: string;
  curp: string;
  street: string;
  neighborhood: string;
  municipality: string;
  postalCode: string;
  state: string;
  phoneNumber: string;
  typeContractRegister: number;
  bankName: string;
  accountNumber: string;
  clabe: string;
  beneficiaryName: string;
  beneficiaryPhoneNumber: string;
  beneficiaryRelation: number;
  emergencyContactName: string;
  emergencyContactPhoneNumber: string;
  emergencyContactRelation: number;
  hasControlledMedication: boolean;
  controlledMedicationDetails: string;
  hasMedicationAllergies: boolean;
  medicationAllergiesDetails: string;
  hasChronicDiseases: boolean;
  chronicDiseasesDetails: string;
  boss: string;
  customerAddress: string;
  turnoTrabajo: number;
  recruitmentSource: number;
  additionalInformation: string;
}

export interface CandidateProcessHiringDialogData {
  id: string;
  candidateProcessId?: string;
  toStage: CandidateApplicationStage;
  candidateFirstName?: string;
  candidateLastName?: string;
  recruitmentSource?: number | null;
}
