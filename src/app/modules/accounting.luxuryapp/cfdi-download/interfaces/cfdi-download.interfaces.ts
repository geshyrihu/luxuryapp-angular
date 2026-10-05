// Corresponde a CustomerSatCredentialDTO (backend)
export interface CustomerSatCredentialDto {
  id: string;
  customerId: string;
  rfcValidado: string;
  vigenciaDesde: string;
  vigenciaHasta: string;
  vigente: boolean;
  updatedBy: string;
  updatedAt: string | null;
}

// Corresponde a CreateSatDownloadRequestDTO (backend)
export interface CreateSatDownloadRequestDto {
  fechaInicio: string;
  fechaFin: string;
}

// Corresponde a SatDownloadRequestDTO (backend)
export interface SatDownloadRequestDto {
  id: string;
  customerId: string;
  fechaInicio: string;
  fechaFin: string;
  estadoSolicitud: string;
  mensajeSat: string | null;
  intentosVerificacion: number;
  cfdiNuevos: number;
  cfdiYaExistian: number;
  cfdiConError: number;
  createdAt: string;
}

// Corresponde a SatCfdiRecibidoDTO (backend)
export interface SatCfdiRecibidoDto {
  id: string;
  uuid: string;
  rfcEmisor: string;
  nombreEmisor: string | null;
  rfcReceptor: string;
  serie: string | null;
  folio: string | null;
  fechaEmision: string;
  fechaTimbrado: string | null;
  tipoComprobante: string;
  moneda: string | null;
  tipoCambio: number | null;
  subTotal: number | null;
  descuento: number | null;
  total: number;
  ivaTrasladado: number | null;
  retencionIsr: number | null;
  retencionIva: number | null;
  formaPago: string | null;
  metodoPago: string | null;
  usoCFDI: string | null;
  estadoSat: string;
  efosEstado: string | null;
  tieneProveedorVinculado: boolean;
}

// Estados "terminales" de una solicitud: ya no hace falta seguir consultando.
export const ESTADOS_SOLICITUD_TERMINALES = ["Descargada", "Fallida"] as const;
