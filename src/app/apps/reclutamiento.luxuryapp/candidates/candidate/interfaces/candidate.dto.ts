import { CandidateStatus } from "src/app/core/enums/candidate-status";
import { CandidateInterviewProgressStatus } from "src/app/core/enums/candidate-interview-progress-status";
import {
  CandidateApplicationListItem,
  CandidateStageHistoryItem,
} from "../../candidate-application/interfaces/candidate-application";

export interface CandidateListItem {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  recruitmentSource?: number;
  recruitmentSourceId?: string;
  photoUrl?: string;
  status: CandidateStatus;
  activeApplicationsCount: number;
  interviewProgress: CandidateInterviewProgressStatus;
  currentCandidateProcessId?: string;
  cvFileName: string;
  cvFileUrl: string;
  lastUpdatedAt?: string;
}

export interface CandidateAddOrEdit {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  email?: string;
  birthDate?: string;
  recruitmentSource?: number;
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
  recruitmentSourceId?: string;
  photoUrl?: string;
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

export interface CandidatePhoneLookup {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  status: CandidateStatus;
  activeApplicationsCount: number;
}

export interface CandidateDeleteImpact {
  candidateId: string;
  candidateProcessesCount: number;
  candidateInterviewsCount: number;
  candidateInterviewResultsCount: number;
  candidateStageHistoryCount: number;
  candidateWorkExperiencesCount: number;
  candidateApplicationRolesCount: number;
  totalRelatedRecordsCount: number;
  relatedEntities: string[];
}

export interface CandidateDuplicateUserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  curp?: string | null;
  rfc?: string | null;
}

export interface CandidateDuplicateCheckResult {
  matchType: number;
  message: string;
  userData: CandidateDuplicateUserData | null;
}
