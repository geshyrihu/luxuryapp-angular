export interface ProcessReconciliationRequestDTO {
    requestId: string;
    fundingId: string;
}

export interface RequestLegacyReconciliationDTO {
    legacyFundingId: string;
    startDate?: string; // Date sent as string usually
    endDate?: string;
}

export interface ReconciledItemDTO {
    uuid: string;
    rfcEmisor: string;
    nombreEmisor: string;
    fechaEmision: string; // DateTime string
    total: number;
    estatusSat: string;
    estatusSistema: string;
    estadoConciliacion: string;
    mensajeDiscrepancia?: string;
}

export interface SatDownloadResponseDTO {
    message: string;
    requestId: string;
    isSuccess: boolean;
    status: string;
    startDate?: string;
    endDate?: string;
}









