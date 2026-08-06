export type CobranzaClasificacion =
  | "SIN ADEUDO"
  | "ANTICIPOS"
  | "COBRANZA JUDICIAL"
  | "MOROSOS"
  | "DEUDA CORRIENTE"
  | "REVISAR";

export interface CobranzaClasificacionResult {
  clasificacion: CobranzaClasificacion;
  isJudicial: boolean;
}

export interface CobranzaClasificacionInput {
  balance?: number;
  currentMonthCharge?: number;
  extraordinaryBalance?: number;
}

export function clasificarCuenta(
  departamento: CobranzaClasificacionInput,
): CobranzaClasificacionResult {
  const balance = departamento.balance || 0;
  const charge = departamento.currentMonthCharge || 0;
  const hasExtraordinary = (departamento.extraordinaryBalance || 0) > 0;

  // Estrategia de clasificación por cargo individual:
  // - Si la cuenta tiene cargo del mes, usarlo como umbral exacto.
  // - Si no tiene cargo (saldo inicial / cuenta irregular), marcar como REVISAR.
  let clasificacion: CobranzaClasificacion = "SIN ADEUDO";
  let isJudicial = false;

  if (balance < 0) {
    clasificacion = "ANTICIPOS";
  } else if (balance === 0) {
    clasificacion = "SIN ADEUDO";
  } else if (charge > 0) {
    // Tiene cargo vigente: clasificar por múltiplos
    if (balance >= charge * 3) {
      clasificacion = "COBRANZA JUDICIAL";
      isJudicial = true;
    } else if (balance >= charge || hasExtraordinary) {
      clasificacion = "MOROSOS";
    } else {
      clasificacion = "DEUDA CORRIENTE";
    }
  } else {
    // Sin cargo vigente este mes: tiene saldo pero no se generó cargo
    // Puede ser saldo inicial o cuenta que cambió de cuota
    clasificacion = "REVISAR";
  }

  return { clasificacion, isJudicial };
}
