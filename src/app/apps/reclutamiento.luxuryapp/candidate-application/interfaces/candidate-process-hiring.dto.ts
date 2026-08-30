import { CandidateProcessStage } from "src/app/core/enums/candidate-process-stage";

export interface CandidateProcessHiringDto {
  firstName: string;
  email: string;
  lastName: string;
  birthDate: string;
  phoneNumber: string;
  matchedUserId?: string | null;
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
