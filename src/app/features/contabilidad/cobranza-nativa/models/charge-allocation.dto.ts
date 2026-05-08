import { EChargeStatus, EChargeType } from "./enums";

export interface PendingChargeDTO {
    id: string;
    type: EChargeType;
    concept: string;
    amount: number;
    amountPaid: number;
    balance: number;
    dueDate: string | Date;
    periodStart?: string | Date;
    periodEnd?: string | Date;
    status: EChargeStatus;
    daysOverdue: number;
    discountAvailable?: number;
    discountDeadline?: string | Date;

    // UI helper: true if selected to apply payment to
    _selected?: boolean;
    // UI helper: amount the user wants to apply to this charge right now
    _applyAmount?: number;
}

export interface ChargeAllocationItemDTO {
    chargeId: string;
    amountToApply: number;
}

export interface ApplyPaymentToChargesDTO {
    paymentId: string;
    allocations: ChargeAllocationItemDTO[];
    appliedBy: string;
    notes?: string;
}

export interface ChargeAllocationResultDTO {
    chargeId: string;
    concept: string;
    amountApplied: number;
    newBalance: number;
    newStatus: EChargeStatus;
}

export interface ApplyPaymentResultDTO {
    paymentId: string;
    totalAmountApplied: number;
    remainingBalance: number;
    chargesFullyPaid: number;
    chargesPartiallyPaid: number;
    allocations: ChargeAllocationResultDTO[];
}









