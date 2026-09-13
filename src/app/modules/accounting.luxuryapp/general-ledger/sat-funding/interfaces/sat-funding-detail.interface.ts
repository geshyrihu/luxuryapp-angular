// Corresponds to SatFundingDetailDto
export interface SatFundingDetailDto {
  id: string;
  customerId: string;
  fundingPeriod: any;
  year: number;
  periodDisplayName: string;
  inProgress: boolean;
  invoices: SatCfdiDto[];
}

// Corresponds to SatCfdiDto
export interface SatCfdiDto {
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

// Corresponds to SatDownloadRequestDto
export interface SatDownloadRequestDto {
  satFundingId: string;
  startDate: string;
  endDate: string;
}

// Corresponds to UpdateSatFundingDetailDto
export interface UpdateSatFundingDetailDto {
  id: string;
  bankId: any | null;
  interbankCode: string | null;
  convenio: string | null;
  referencia: string | null;
  tipoGasto: any; // ESatTipoGasto
}

// Corresponds to BulkUpdateTipoGastoDto
export interface BulkUpdateTipoGastoDto {
  satFundingDetailIds: string[];
  newTipoGasto: any; // ESatTipoGasto
}









