import { CandidateStatus } from "src/app/core/enums/candidate-status";
import { FuenteReclutamiento } from "src/app/core/enums/fuente-reclutamiento";
import {
  CandidateApplicationListItem,
  CandidateStageHistoryItem,
} from "../../candidate-application/interfaces/candidate-application";

export interface CandidateListItem {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  status: CandidateStatus;
  activeApplicationsCount: number;
  lastUpdatedAt?: string;
}

export interface CandidateAddOrEdit {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  email?: string;
  age?: number;
  currentAddress?: string;
  livesNearWorkplace?: boolean;
  availability?: string;
  salaryExpectation?: number;
  experienceSummary?: string;
  recruitmentSource?: FuenteReclutamiento;
  generalComments?: string;
}

export interface CandidateDetail extends CandidateAddOrEdit {
  id: string;
  fullName: string;
  status: CandidateStatus;
  applications: CandidateApplicationListItem[];
  stageHistory: CandidateStageHistoryItem[];
}