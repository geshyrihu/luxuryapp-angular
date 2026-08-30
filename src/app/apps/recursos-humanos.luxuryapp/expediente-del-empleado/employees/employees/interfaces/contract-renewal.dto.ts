export type ContractRenewalStatus =
  | "EnAnalisis"
  | "EvaluacionCompletada"
  | "Decidido"
  | "Cancelado";

export type ContractRenewalDecision = "Renovar" | "NoRenovar" | "RenovarConCambios";

export interface ContractRenewalEvaluationDTO {
  id: string;
  employeeWorkContractId: string;
  contractNumber: string;
  employeeName: string;
  positionName: string;
  contractEndDate: string | null;
  performanceEvaluationId: string | null;
  status: ContractRenewalStatus;
  decision: ContractRenewalDecision | null;
  evaluationStartDate: string | null;
  decisionDate: string | null;
  comments: string;
  justification: string;
  evaluatedByUserId: string | null;
  evaluatedByUserName: string | null;
  createdAt: string;
}

export interface ContractRenewalDecisionDTO {
  decision: ContractRenewalDecision;
  decisionDate: string;
  comments?: string;
  justification?: string;
}