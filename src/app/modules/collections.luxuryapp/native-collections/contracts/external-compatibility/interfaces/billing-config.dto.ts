import { EBillingMode } from "./billing-mode.enum";

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
