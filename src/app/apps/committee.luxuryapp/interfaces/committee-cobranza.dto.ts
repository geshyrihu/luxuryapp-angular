import { AspelCobranzaDetalleResponse } from "../../cobranza.luxuryapp/aspel-cobranza-haus/aspel-cobranza-haus.models";

export interface CommitteeMorososResponseDto {
  customerId: string;
  fechaCorte: string;
  totalMorosos: number;
  totalDeudaPendiente: number;
  propiedades: CommitteeMorosoItemDto[];
  totalDepartamentos: number;
  cargosDelMes: number;
  abonosDelMes: number;
  saldoNetoDelMes: number;
  currentCharges: any;
  categories: any[];
}

export interface CommitteeMorosoItemDto {
  numCtaBase: string;
  departamento: string;
  saldoPendiente: number;
  saldoMantenimiento: number;
  saldoExtraordinario: number;
  saldoMultas: number;
  totalConceptos: number;
  // Propiedad extendida para la UI que cargará el detalle de manera perezosa
  detalle?: AspelCobranzaDetalleResponse;
  cargandoDetalle?: boolean;
}

export interface CobranzaOnlineStatementResponseDto {
  accountId: string;
  accountNumber: string;
  accountName: string;
  propertyId?: string;
  propertyFullName: string;
  year: number;
  initialBalance: number;
  totalDebits: number;
  totalCredits: number;
  finalBalance: number;
  movimientos: CobranzaOnlineMovementResponseDto[];
}

export interface CobranzaOnlineMovementResponseDto {
  id: string;
  tipoPoliza: string;
  numeroPoliza: string;
  fechaPoliza: string;
  numeroPartida: number;
  conceptoPoliza: string;
  montoCargo: number;
  montoAbono: number;
  numeroCuenta: string;
  nombreCuenta: string;
  departamentoId: number;
}
