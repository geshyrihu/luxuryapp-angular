import { EFinancialEventType } from './enums';

export interface FinancialLedgerEntryDTO {
  id: string;
  customerId: string;
  propertyId: string;
  batchId: string;
  eventType: EFinancialEventType;
  debitAmount: number;
  creditAmount: number;
  effectiveDate: string;
  description: string;
  createdAt: string;
  createdBy: string;
  chargeId: string | null;
  paymentId: string | null;
  allocationId: string | null;
}

export interface LedgerIntegrityReportDTO {
  customerId: string;
  checkedAt: string;
  totalPropertiesChecked: number;
  propertiesWithDiscrepancies: number;
  totalDiscrepancyAmount: number;
  discrepancies: PropertyIntegrityResultDTO[];
}

export interface PropertyIntegrityResultDTO {
  propertyId: string;
  propertyName: string;
  operationalBalance: number;
  ledgerBalance: number;
  discrepancy: number;
  hasDiscrepancy: boolean;
  ledgerEntryCount: number;
  openChargeCount: number;
}
