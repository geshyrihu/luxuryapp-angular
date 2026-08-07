import type { CobranzaOnlineSyncMetadata } from "./cobranza-online-sync.model";

export interface CobranzaOnlineAnalysisCondomino {
  numeroCuenta: string;
  condomino: string;
  saldo: number;
  clasificacion: string;
}

export interface CobranzaOnlineAnalysisResponse {
  customerId: string;
  year: number;
  month: number;
  day: number;
  periodo: string;
  cutoffDate: string;
  dataSource: string;
  totalCondominios: number;
  cuotaMttoVigente: number;
  cuotaExtraordinariaVigente: number;
  cuotaMensualTotal: number;
  cobranzaPerfecta: number;
  totalJudicial: number;
  totalMorosos: number;
  totalDeudaCorriente: number;
  totalSinAdeudo: number;
  totalAnticipos: number;
  totalDeuda: number;
  /** Residual histórico del Excel: cobranzaPerfecta - morosos - deudaCorriente. */
  totalCobrado: number;
  /** Flujo de caja: abonos del mes a las subcuentas -001 y -003. */
  cobradoMes: number;
  /** Abonos del mes a mantenimiento (-001). */
  cobradoMttoMes: number;
  /** Abonos del mes a extraordinaria (-003); puede haberlos sin cuota vigente. */
  cobradoExtraordinariaMes: number;
  /** cobranzaPerfecta - cobradoMes. */
  faltanteMes: number;
  saldoBalanza: number;
  syncMetadata: CobranzaOnlineSyncMetadata;
  cobranzaJudicial: CobranzaOnlineAnalysisCondomino[];
  morosos: CobranzaOnlineAnalysisCondomino[];
  deudaCorriente: CobranzaOnlineAnalysisCondomino[];
  sinAdeudo: CobranzaOnlineAnalysisCondomino[];
  anticipos: CobranzaOnlineAnalysisCondomino[];
}
