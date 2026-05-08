export interface FundingDetailDTO {
  periodo: string;
  rango: string;
  customerName: string;
  customerPhoto: string;
  isVerified: boolean;
  isAuthorized: boolean;
  isConfirmed: boolean;
  verifiedBy: string;
  verifiedAt: string;
  authorizedBy: string;
  authorizedAt: string;
  tesorero: string;
  inProgress: boolean;
  grupos: FundingGastoDTO[];
}

export interface FundingGastoDTO {
  key: number;
  tipoGasto: string;
  totalGrupo: number;
  ordenes: FundingOrdenDTO[];
}

export interface FundingOrdenDTO {
  ordenCompraId: string;
  ordenCompraPagada: boolean;
  indice: string;
  fechaSolicitud: string;
  justificacionGasto: string;
  total: number;
  factura: string;
  pdfFile: string;
  accountNumber: string;
  accountName: string;
  nameProvider: string;
  rfc: string;
  cuentaClave: string;
  convenio: string;
  reference: string;
  shortName: string;
  ordenCompraDatosPagoId: string;
  folioFiscal: string;
  fechaFactura: string;
  validationStatus?: boolean;
  validationMessage?: string;
}









