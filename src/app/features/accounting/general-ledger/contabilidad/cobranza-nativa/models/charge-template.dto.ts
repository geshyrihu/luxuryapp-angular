import { ECalculationMethod, EChargeType, EDiscountType, ERecurrence } from './enums';

export interface ChargeTemplateResponseDTO {
    id: string;
    customerId: string;
    name: string;
    calculationMethod: ECalculationMethod;
    chargeTypeId?: string | null;
    chargeTypeCode?: string | null;
    chargeTypeName?: string | null;
    chargeTypeAccountNumber?: string | null;
    chargeType: EChargeType;
    amount: number;
    recurrence: ERecurrence;
    dayOfMonth: number;
    applyToAllProperties: boolean;
    isRetroactive: boolean;
    retroactiveStartDate?: string | null;
    startDate: string;
    endDate?: string | null;
    earlyPaymentDiscount?: number | null;
    earlyPaymentDiscountType?: EDiscountType | null;
    earlyPaymentGraceDays?: number | null;
    isActive: boolean;
}

export interface CreateChargeTemplateDTO {
    customerId: string;
    name: string;
    calculationMethod: ECalculationMethod;
    chargeTypeId?: string | null;
    chargeType?: EChargeType | null;
    amount: number;
    recurrence: ERecurrence;
    dayOfMonth: number;
    startDate: string | Date;
    endDate?: string | Date | null;
    earlyPaymentDiscount?: number | null;
    earlyPaymentDiscountType?: EDiscountType | null;
    earlyPaymentGraceDays?: number | null;
    applyToAllProperties: boolean;
    isRetroactive: boolean;
    retroactiveStartDate?: string | Date | null;
    isActive: boolean;
}

export interface UpdateChargeTemplateDTO {
    id: string;
    name: string;
    calculationMethod: ECalculationMethod;
    chargeTypeId?: string | null;
    chargeType?: EChargeType | null;
    amount: number;
    recurrence: ERecurrence;
    dayOfMonth: number;
    startDate: string | Date;
    endDate?: string | Date | null;
    earlyPaymentDiscount?: number | null;
    earlyPaymentDiscountType?: EDiscountType | null;
    earlyPaymentGraceDays?: number | null;
    applyToAllProperties: boolean;
    isRetroactive: boolean;
    retroactiveStartDate?: string | Date | null;
    isActive: boolean;
}









