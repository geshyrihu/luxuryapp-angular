import { EFinancialApprovalOperationType, EFinancialApprovalStatus } from './enums';

export interface FinancialApprovalResponseDTO {
  id: string;
  customerId: string;
  propertyId: string | null;
  operationType: EFinancialApprovalOperationType;
  status: EFinancialApprovalStatus;
  summary: string;
  requestedBy: string;
  requestedAt: string;
  requestNotes: string | null;
  operationPayload: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
  isExecuted: boolean;
  executedAt: string | null;
}

export interface CreateFinancialApprovalRequestDTO {
  customerId: string;
  propertyId: string | null;
  operationType: EFinancialApprovalOperationType;
  summary: string;
  operationPayload: string;
  requestedBy: string;
  requestNotes: string | null;
}
