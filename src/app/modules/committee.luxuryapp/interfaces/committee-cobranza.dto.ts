import { AspelCobranzaDetalleResponse } from "../../cobranza.luxuryapp/aspel-cobranza-haus/aspel-cobranza-haus.models";

export type CommitteeClasificacion =
  | "COBRANZA JUDICIAL"
  | "MOROSOS"
  | "DEUDA CORRIENTE"
  | "SIN ADEUDO"
  | "ANTICIPOS";

export interface CommitteeMetricaCuota {
  total: number;
  collected: number;
  pending: number;
}

export interface CommitteeCurrentCharges {
  maintenance: CommitteeMetricaCuota;
  extraordinary: CommitteeMetricaCuota;
  monthlyFeeTotal: number;
}

export interface CommitteeMorososResponseDto {
  customerId: string;
  fechaCorte: string;
  /** Condóminos con saldo > 0, de cualquier clasificación. No son "morosos". */
  totalMorosos: number;
  totalDeudaPendiente: number;
  propiedades: CommitteeMorosoItemDto[];
  totalDepartamentos: number;
  cargosDelMes: number;
  abonosDelMes: number;
  saldoNetoDelMes: number;
  currentCharges: CommitteeCurrentCharges;

  /** Meta del mes: cargos de mantenimiento + extraordinaria. */
  cobranzaPerfecta: number;
  /** Abonos aplicados en el mes a las cuentas de cuota. */
  cobradoDelMes: number;
  /** Condóminos clasificados MOROSOS por la regla de cuotas vencidas. */
  cantidadMorosos: number;
  deudaMorosos: number;
  cantidadJudicial: number;
  deudaJudicial: number;
}

export interface CommitteeMorosoItemDto {
  numCtaBase: string;
  departamento: string;
  saldoPendiente: number;
  saldoMantenimiento: number;
  saldoExtraordinario: number;
  saldoMultas: number;
  totalConceptos: number;
  clasificacion: CommitteeClasificacion | string;
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
