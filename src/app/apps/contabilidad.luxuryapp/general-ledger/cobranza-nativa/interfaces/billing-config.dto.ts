import { EBillingMode } from './enums';

export interface BillingConfigResponseDTO {
  id: string;
  customerId: string;
  billingMode: EBillingMode;
  defaultDueDays: number;
  graceDays: number;
  globalLateFeePercentage?: number;
}

export interface UpsertBillingConfigDTO {
  customerId: string;
  billingMode: EBillingMode;
  defaultDueDays: number;
  graceDays: number;
  globalLateFeePercentage?: number;
}
