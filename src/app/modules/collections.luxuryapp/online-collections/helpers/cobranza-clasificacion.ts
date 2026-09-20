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
  classification?: string;
}

export function clasificarCuenta(
  departamento: CobranzaClasificacionInput,
): CobranzaClasificacionResult {
  const clasificacionStr = departamento.classification || "SIN ADEUDO";
  
  // Cast to the precise type. Default to REVISAR if unknown.
  let clasificacion: CobranzaClasificacion;
  switch (clasificacionStr) {
    case "SIN ADEUDO":
    case "ANTICIPOS":
    case "COBRANZA JUDICIAL":
    case "MOROSOS":
    case "DEUDA CORRIENTE":
    case "REVISAR":
      clasificacion = clasificacionStr as CobranzaClasificacion;
      break;
    default:
      clasificacion = "REVISAR";
  }

  const isJudicial = clasificacion === "COBRANZA JUDICIAL";

  return { clasificacion, isJudicial };
}
