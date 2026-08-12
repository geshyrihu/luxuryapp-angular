import { CandidateApplicationStage } from "src/app/core/enums/candidate-application-stage";
import { CandidateDecision } from "src/app/core/enums/candidate-decision";

export interface CandidateApplicationListItem {
  id: string;
  candidateId: string;
  candidateName: string;
  requestPositionId: string;
  vacancyFolio: string;
  positionName: string;
  customerName: string;
  customerId: string;
  currentStage: CandidateApplicationStage;
  cvFileName: string;
  cvFileUrl: string;
  operationsInterviewAt?: string;
  assignedInterviewerName: string;
  assignedInterviewerUserId: string;
  lastDecision?: CandidateDecision;
}

export interface CandidateRecruitmentAgendaItem {
  id: string;
  candidateId: string;
  candidateName: string;
  workPositionId: string;
  requestPositionId: string;
  vacancyFolio: string;
  positionName: string;
  customerName: string;
  customerId: string;
  currentStage: CandidateApplicationStage;
  scheduledInterviewAt?: string;
  assignedInterviewerUserId: string;
  assignedInterviewerName: string;
  receptionConfirmedAt?: string;
  feedbackSentAt?: string;
  agendaStatusCode: string;
  agendaStatusLabel: string;
  pendingAction: string;
  daysInStage: number;
  isOverdue: boolean;
  cvFileName: string;
  cvFileUrl: string;
}

export interface CandidateApplicationDetail extends CandidateApplicationListItem {
  applicationDate: string;
  recruitmentInterviewAt?: string;
  operationsInterviewAssignedToUserId: string;
  lastDecisionReasonName: string;
  lastDecisionComment: string;
  selectedForHiring: boolean;
  hiringRequestedAt?: string;
  closedAt?: string;
  lastStageChange?: CandidateStageHistoryItem | null;
  stageHistory?: CandidateStageHistoryItem[];
}

export interface CandidateStageHistoryItem {
  id: string;
  fromStage?: CandidateApplicationStage;
  toStage: CandidateApplicationStage;
  comment: string;
  changedByUserId: string;
  changedAt: string;
}

export interface CandidateApplicationAddOrEdit {
  candidateId: string;
  requestPositionId: string;
  cvFileName: string;
  applicationDate?: string;
  recruitmentInterviewAt?: string;
  initialComment?: string;
}

export interface ChangeStageApplicationRequest {
  toStage: CandidateApplicationStage;
  comment: string;
  recruitmentInterviewAt?: string;
  operationsInterviewAt?: string;
  operationsInterviewAssignedToUserId?: string;
}

export interface CandidateDecisionRequest {
  decision: CandidateDecision;
  reasonId?: string;
  comment?: string;
}

export interface CandidateApplicationKpisDto {
  vacantesAbiertas: number;
  vacantesSinPostulacion: number;
  porcentajeVacantesConPostulacion: number;
  postulacionesActivas: number;
  postulacionesEnNuevo: number;
  postulacionesEnPreFiltro: number;
  postulacionesEnEspera: number;
  postulacionesEnEntrevistaReclutamiento: number;
  postulacionesEnEntrevistaOperaciones: number;
  postulacionesSeleccionadas: number;
  postulacionesAltaEnProceso: number;
  postulacionesContratadas: number;
  postulacionesRechazadasONoPresentadas: number;
  entrevistasOperacionesSinEntrevistador: number;
  entrevistasOperacionesPendientesAgenda: number;
  entrevistasOperacionesVencidas: number;
  entrevistasOperacionesAgendadas: number;
  entrevistasOperacionesConFeedback: number;
  postulacionesSinFeedbackEnEntrevista: number;
  promedioDiasHastaEntrevistaOperaciones: number | null;
  promedioDiasEnEtapaActual: number;
  tasaSeleccion: number;
  porFuente: FuenteKpiItem[];
  postulacionesUltimos7Dias: number;
  postulacionesUltimos30Dias: number;
  // V2-F2: Tiempo Vacante -> Primera Postulacion
  promedioDiasVacanteAPrimeraPostulacion: number | null;
  medianaDiasVacanteAPrimeraPostulacion: number | null;
  percentil90DiasVacanteAPrimeraPostulacion: number | null;
  vacantesConPostulacionEnSla: number;
  vacantesConPostulacion: number;
  porcentajeVacantesEnSla: number;
}

export interface FuenteKpiItem {
  fuente: string;
  totalPostulaciones: number;
  contratados: number;
  tasaConversion: number;
}
