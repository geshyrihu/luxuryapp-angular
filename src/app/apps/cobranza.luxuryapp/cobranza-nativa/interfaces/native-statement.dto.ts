export interface NativeStatementResponseDTO {
    propertyInfo: PropertyInfoDTO;
    summary: StatementSummaryDTO;
    ledger: LedgerEntryDTO[];
}

export interface SendNativeStatementBatchResponseDTO {
    totalPropertiesEvaluated: number;
    sentProperties: number;
    skippedProperties: number;
    failedProperties: number;
}

export interface PropertyInfoDTO {
    propertyId: string;
    propertyName: string;
    customerName: string;
    indivisoPercentage: number;
}

export interface StatementSummaryDTO {
    totalDebt: number;
    totalCreditBalance: number;
    totalToPay: number;
}

export interface LedgerEntryDTO {
    id: string;
    date: string;
    concept: string;
    type: string;
    cargo: number;
    abono: number;
    balance: number;
    reference: string;
}









