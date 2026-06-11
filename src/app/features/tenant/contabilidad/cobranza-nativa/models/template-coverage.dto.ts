import { ECalculationMethod, EChargeType, ERecurrence } from "./enums";

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
  chargeType: EChargeType;
  calculationMethod: ECalculationMethod;
  baseAmount: number;
  recurrence: ERecurrence;
  startDate: string;
  endDate: string | null;
  periods: PeriodAmountDTO[];
}
