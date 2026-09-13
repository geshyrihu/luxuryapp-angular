export interface FinancialAuditLogDTO {
  id: string;
  customerId: string;
  propertyId: string | null;
  operationType: string;
  summary: string;
  entityType: string | null;
  entityId: string | null;
  actor: string;
  occurredAt: string;
  isSuccess: boolean;
  detail: string | null;
}
