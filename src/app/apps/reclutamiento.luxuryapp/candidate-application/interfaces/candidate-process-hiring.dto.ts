import { CandidateProcessStage } from "src/app/core/enums/candidate-process-stage";

export interface CandidateProcessHiringDto {
  executionDate: string;
  firstName: string;
  email: string;
  lastName: string;
  birthDate: string;
  nss: string;
  rfc: string;
  rfcPostalCode: string;
  curp: string;
  maritalStatus: number | null;
  educationLevel: number | null;
  hasInfonavitCredit: boolean;
  infonavitCreditNumber: string;
  infonavitDiscountFactor: string;
  street: string;
  neighborhood: string;
  municipality: string;
  postalCode: string;
  state: string;
  phoneNumber: string;
  typeContractRegister: number;
  bankId: string;
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
  additionalInformation: string;
}

export interface CandidateProcessHiringDialogData {
  id?: string;
  candidateProcessId?: string;
  candidateId?: string | null;
  requestPositionId?: string | null;
  isDraftCompletion?: boolean;
  toStage?: CandidateProcessStage;
  candidateFirstName?: string;
  candidateLastName?: string;
}
