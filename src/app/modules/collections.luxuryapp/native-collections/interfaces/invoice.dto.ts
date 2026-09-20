export interface InvoiceResponseDTO {
  id: string;
  customerId: string;
  chargeId: string;
  uuid: string;
  serie: string | null;
  folio: string | null;
  status: string;
  xmlFilePath: string;
  pdfFilePath: string;
  timbreAt: string | null;
}

export interface GenerateInvoiceDTO {
  chargeId: string;
  customerId: string;
}

export interface CancelInvoiceDTO {
  motive: string;
  replacementUuid: string | null;
}
