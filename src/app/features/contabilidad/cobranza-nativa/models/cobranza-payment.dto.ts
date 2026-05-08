import { EPaymentMethod, EPaymentStatus } from './enums';

export interface CobranzaPaymentResponseDTO {
    id: string;
    customerId: string;
    propertyId: string;
    propertyFullName: string;
    amount: number;
    paymentDate: Date;
    method: EPaymentMethod;
    reference?: string;
    status: EPaymentStatus;
    bankAccountId?: string | null;
    coiPolicyId?: string | null;
}

export interface CreateCobranzaPaymentDTO {
    customerId: string;
    propertyId: string;
    amount: number;
    paymentDate: Date;
    method: EPaymentMethod;
    reference?: string;
    status: EPaymentStatus;
    bankAccountId?: string | null;
    coiPolicyId?: string | null;
}

export interface UpdateCobranzaPaymentDTO {
    id: string;
    propertyId: string;
    amount: number;
    paymentDate: Date;
    method: EPaymentMethod;
    reference?: string;
    status: EPaymentStatus;
    bankAccountId?: string | null;
    coiPolicyId?: string | null;
}









