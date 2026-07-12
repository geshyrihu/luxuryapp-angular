import { ELateFeeType } from './enums';

export interface LateFeePolicyResponseDTO {
    id: string;
    customerId: string;
    graceDays: number;
    type: ELateFeeType;
    rate: number;
    compoundsMonthly: boolean;
    maxRate: number;
}

export interface CreateLateFeePolicyDTO {
    customerId: string;
    graceDays: number;
    type: ELateFeeType;
    rate: number;
    compoundsMonthly: boolean;
    maxRate: number;
}

export interface UpdateLateFeePolicyDTO {
    id: string;
    graceDays: number;
    type: ELateFeeType;
    rate: number;
    compoundsMonthly: boolean;
    maxRate: number;
}









