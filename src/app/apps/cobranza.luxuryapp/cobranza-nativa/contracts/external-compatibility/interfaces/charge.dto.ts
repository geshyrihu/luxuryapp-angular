import { EChargeStatus, EChargeType } from "../../../interfaces/enums";

export interface ChargeResponseDTO {
  id: string;
  customerId: string;
  propertyId: string;
  propertyFullName: string;
  coiCobranzaAccountId?: string | null;
  chargeTypeId?: string | null;
  chargeTypeCode?: string | null;
  chargeTypeName?: string | null;
  chargeTypeAccountNumber?: string | null;
  type: EChargeType;
  concept: string;
  amount: number;
  dueDate: Date | string;
  periodStart?: Date | string | null;
  periodEnd?: Date | string | null;
  status: EChargeStatus;
  generatedAutomatically: boolean;
  sourcePolicyId?: string | null;
  chargeTemplateId?: string | null;
  discountAvailable?: number | null;
  discountDeadline?: Date | string | null;
}

export interface CreateChargeDTO {
  customerId: string;
  propertyId: string;
  chargeTypeId?: string | null;
  type?: EChargeType | null;
  concept: string;
  amount: number;
  dueDate: Date | string;
  periodStart?: Date | string | null;
  periodEnd?: Date | string | null;
  status: EChargeStatus;
  generatedAutomatically: boolean;
  sourcePolicyId?: string | null;
  chargeTemplateId?: string | null;
  discountAvailable?: number | null;
  discountDeadline?: Date | string | null;
}

export interface PropertyInitialBalanceDTO {
  propertyId: string;
  propertyFullName: string;
  accountNumber: string;
  hasSaldoInicial: boolean;
  existingChargeId?: string | null;
  existingAmount?: number | null;
}

export interface SetInitialBalanceItemDTO {
  propertyId: string;
  amount: number;
  dueDate?: Date | string | null;
}

export interface BulkSetInitialBalanceDTO {
  customerId: string;
  items: SetInitialBalanceItemDTO[];
}

export interface BulkSetInitialBalanceResultDTO {
  created: number;
  updated: number;
  skipped: number;
}

export interface UpdateChargeDTO {
  id: string;
  propertyId: string;
  chargeTypeId?: string | null;
  type?: EChargeType | null;
  concept: string;
  amount: number;
  dueDate: Date | string;
  periodStart?: Date | string | null;
  periodEnd?: Date | string | null;
  status: EChargeStatus;
  generatedAutomatically: boolean;
  sourcePolicyId?: string | null;
  chargeTemplateId?: string | null;
  discountAvailable?: number | null;
  discountDeadline?: Date | string | null;
}
