import { EPaymentMethod, EPaymentStatus } from "../../../interfaces/enums";

export interface CobranzaPaymentResponseDTO {
  id: string;
  customerId: string;
  propertyId: string;
  propertyFullName: string;
  amount: number;
  allocatedAmount: number;
  unappliedAmount: number;
  paymentDate: Date | string;
  method: EPaymentMethod;
  reference?: string;
  status: EPaymentStatus;
  bankAccountId?: string | null;
  coiPolicyId?: string | null;
  allocations?: CobranzaPaymentAllocationDetailDTO[];
}

export interface CobranzaPaymentAllocationDetailDTO {
  allocationId: string;
  chargeId: string;
  chargeTypeId?: string | null;
  chargeTypeCode?: string | null;
  chargeTypeName?: string | null;
  chargeTypeAccountNumber?: string | null;
  chargeConcept: string;
  amountApplied: number;
  appliedAt: string | Date;
  appliedBy?: string | null;
}

export interface CreateCobranzaPaymentDTO {
  customerId: string;
  propertyId: string;
  amount: number;
  paymentDate: Date | string;
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
  paymentDate: Date | string;
  method: EPaymentMethod;
  reference?: string;
  status: EPaymentStatus;
  bankAccountId?: string | null;
  coiPolicyId?: string | null;
}
