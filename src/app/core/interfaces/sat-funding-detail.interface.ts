// Corresponds to SatFundingDetailDTO
export interface SatFundingDetailDTO {
  id: string;
  customerId: string;
  fundingPeriod: any;
  year: number;
  periodDisplayName: string;
  inProgress: boolean;
  invoices: SatCfdiDTO[];
}

// Corresponds to SatCfdiDTO
export interface SatCfdiDTO {
  satCfdiId: string; // UUID
  satFundingDetailId: string;
  sortOrder: number | null;
  tipoGasto: any; // ESatTipoGasto
  fechaEmision: Date;
  folio: string | null;
  emisorRfc: string;
  emisorNombre: string;
  total: number;
  usoCFDI: string;
  xmlPath: string;
  pdfPath: string;
  bankId: any | null;
  bankShortName: string | null;
  interbankCode: string | null; // CLABE
  convenio: string | null;
  referencia: string | null;
  accountNumber: string | null;
  accountName: string | null;
  isManuallyEdited: boolean;
}

// Corresponds to SatDownloadRequestDTO
export interface SatDownloadRequestDTO {
  satFundingId: string;
  startDate: string;
  endDate: string;
}

// Corresponds to UpdateSatFundingDetailDTO
export interface UpdateSatFundingDetailDTO {
  id: string;
  bankId: any | null;
  interbankCode: string | null;
  convenio: string | null;
  referencia: string | null;
  tipoGasto: any; // ESatTipoGasto
}

// Corresponds to BulkUpdateTipoGastoDTO
export interface BulkUpdateTipoGastoDTO {
  satFundingDetailIds: string[];
  newTipoGasto: any; // ESatTipoGasto
}









