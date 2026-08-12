import { CandidateStatus } from "src/app/core/enums/candidate-status";
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
  availability?: string;
  salaryExpectation?: number;
  experienceSummary?: string;
  generalComments?: string;
}

export interface CandidateDetail extends CandidateAddOrEdit {
  id: string;
  fullName: string;
  cvFileName: string;
  cvFileUrl: string;
  status: CandidateStatus;
  applications: CandidateApplicationListItem[];
  stageHistory: CandidateStageHistoryItem[];
  workExperiences?: CandidateWorkExperienceItem[];
}

export interface CandidateWorkExperienceItem {
  id: string;
  candidateId: string;
  companyName: string;
  jobPosition: string;
  startDate: string;
  endDate?: string;
  monthlyNetSalary?: number;
  departureReason?: string;
}

export interface CandidateWorkExperienceAddOrEdit {
  id?: string;
  candidateId?: string;
  companyName: string;
  jobPosition: string;
  startDate: string;
  endDate?: string | null;
  monthlyNetSalary?: number | null;
  departureReason?: string | null;
}
