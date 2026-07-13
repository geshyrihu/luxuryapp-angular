import { ECalculationMethod, EChargeType, Recurrence } from "./enums";

export interface PeriodAmountDTO {
  year: number;
  month: number;
  label: string;
  amount: number;
}

export interface TemplateCoverageDTO {
  propertyId: string;
  propertyName: string;
  accountNumber: string;
  indivisoPercentage: number | null;
  templateId: string;
  templateName: string;
  chargeTypeId?: string | null;
  chargeType: EChargeType;
  chargeTypeCode?: string | null;
  chargeTypeName?: string | null;
  chargeTypeAccountNumber?: string | null;
  calculationMethod: ECalculationMethod;
  baseAmount: number;
  recurrence: Recurrence;
  startDate: string;
  endDate: string | null;
  periods: PeriodAmountDTO[];
}
