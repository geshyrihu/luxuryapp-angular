import { AspelCobranzaDetalleResponse } from "../../cobranza.luxuryapp/aspel-cobranza-haus/aspel-cobranza-haus.models";

export interface CommitteeMorososResponseDto {
  customerId: string;
  fechaCorte: string;
  totalMorosos: number;
  totalDeudaPendiente: number;
  propiedades: CommitteeMorosoItemDto[];
}

export interface CommitteeMorosoItemDto {
  numCtaBase: string;
  departamento: string;
  saldoPendiente: number;
  totalConceptos: number;
  // Propiedad extendida para la UI que cargará el detalle de manera perezosa
  detalle?: AspelCobranzaDetalleResponse;
  cargandoDetalle?: boolean;
}
