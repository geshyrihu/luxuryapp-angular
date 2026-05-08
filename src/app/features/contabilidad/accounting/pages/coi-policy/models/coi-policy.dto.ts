export interface CoiPolicyResponseDTO {
    id: string;
    customerId: string;
    policyType: number; // Enum: ECoiPolicyType (1: Ingreso, 2: Egreso, 3: Diario)
    policyNumber: number;
    date: string;
    concept: string;
    totalAmount: number;
    details: CoiPolicyDetailResponseDTO[];
}

export interface CoiPolicyDetailResponseDTO {
    id: string;
    policyId: string;
    accountId: string;
    accountNumber: string;
    accountName: string;
    propertyId?: string;
    providerId?: string;
    concept: string;
    amount: number;
    nature: number; // 1 = Cargo, -1 = Abono
}

export interface CoiPolicyAddDTO {
    customerId: string;
    policyType: number;
    policyNumber: number;
    date: string | Date;
    concept: string;
    createdById?: string;
    details: CoiPolicyDetailAddDTO[];
}

export interface CoiPolicyUpdateDTO extends CoiPolicyAddDTO {
    id: string;
}

export interface CoiPolicyDetailAddDTO {
    accountId: string;
    propertyId?: string;
    providerId?: string;
    concept: string;
    amount: number;
    nature: number;
}









