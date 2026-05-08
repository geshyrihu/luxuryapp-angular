export interface CoiBudgetResponseDTO {
    id: string;
    customerId: string;
    accountId: string;
    accountNumber: string;
    accountName: string;
    year: number;
    budget01: number;
    budget02: number;
    budget03: number;
    budget04: number;
    budget05: number;
    budget06: number;
    budget07: number;
    budget08: number;
    budget09: number;
    budget10: number;
    budget11: number;
    budget12: number;
    budget13: number;
    budget14: number;
}

export interface CoiBudgetAddDTO {
    customerId: string;
    accountId: string;
    year: number;
    budget01: number;
    budget02: number;
    budget03: number;
    budget04: number;
    budget05: number;
    budget06: number;
    budget07: number;
    budget08: number;
    budget09: number;
    budget10: number;
    budget11: number;
    budget12: number;
    budget13: number;
    budget14: number;
}

export interface CoiBudgetUpdateDTO extends CoiBudgetAddDTO {
    id: string;
}

// ----------------------------------------------------
// PERIODOS FISCALES
// ----------------------------------------------------

export interface CoiFiscalPeriodResponseDTO {
    id: string;
    customerId: string;
    year: number;
    month: number;
    isClosed: boolean;
}

export interface CoiFiscalPeriodAddDTO {
    customerId: string;
    year: number;
    month: number;
    isClosed: boolean;
}

export interface CoiFiscalPeriodUpdateDTO extends CoiFiscalPeriodAddDTO {
    id: string;
}









