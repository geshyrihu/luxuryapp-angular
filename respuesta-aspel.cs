// ================================================================
//  Aspel COI 10 — DTOs de Respuesta para LuxuryApp API
//  Base: Esquema Firebird (imagen de tablas)
//  Convenciones JSON:
//    · camelCase en todos los nombres de campo
//    · double para montos — nunca string, nunca null → usar 0.0
//    · string vacío "" en lugar de null para textos
//    · Fechas en ISO 8601: "2025-01-15T00:00:00"
//  Última revisión: Marzo 2026
// ================================================================

using System.Text.Json.Serialization;

namespace LuxuryApp.Api.Dtos.Aspel;


// ================================================================
//  SNAPSHOT — Raíz del endpoint GET /api/AspelData/snapshot?ejercicio=
//  Agrupa las 4 tablas en un solo response para evitar round-trips
// ================================================================

public class Data
{
  [JsonPropertyName("IdEmpresa")]
  public int IdEmpresa { get; set; }
  [JsonPropertyName("NombreEmpresa")]
  public string NombreEmpresa { get; set; }
  [JsonPropertyName("ejercicio")]
  public int Ejercicio { get; set; }

  [JsonPropertyName("generadoEn")]
  public DateTime GeneradoEn { get; set; }

  /// <summary>Catálogo de cuentas contables — tabla CUENTAS25</summary>
  [JsonPropertyName("cuentas")]
  public List<Cuentas> Cuentas { get; set; } = [];

  /// <summary>Saldos mensuales por cuenta — tabla SALDOS25</summary>
  [JsonPropertyName("saldos")]
  public List<Saldos> Saldos { get; set; } = [];

  /// <summary>Presupuestos mensuales por cuenta — tabla PRESUP25</summary>
  [JsonPropertyName("presupuestos")]
  public List<Presupuesto> Presupuestos { get; set; } = [];

  /// <summary>Pólizas con sus partidas anidadas — POLIZAS25 + AUXILIAR25</summary>
  [JsonPropertyName("polizas")]
  public List<Polizas> Polizas { get; set; } = [];
}


// ================================================================
//  CUENTAS25
//  PK: NUM_CTA
// ================================================================

public class Cuentas
{
  // ── Identificador ────────────────────────────────────────────
  /// <summary>Número de cuenta formato "000-000-000" · NUM_CTA</summary>
  [JsonPropertyName("num_Cta")]
  public string Num_Cta { get; set; } = string.Empty;

  // ── Datos generales ──────────────────────────────────────────
  /// <summary>"A"=Activa "I"=Inactiva · STATUS</summary>
  [JsonPropertyName("status")]
  public string Status { get; set; } = string.Empty;

  /// <summary>Tipo de cuenta · TIPO</summary>
  [JsonPropertyName("tipo")]
  public string Tipo { get; set; } = string.Empty;

  /// <summary>Nombre o descripción de la cuenta · NOMBRE</summary>
  [JsonPropertyName("nombre")]
  public string Nombre { get; set; } = string.Empty;

  /// <summary>Maneja departamentos "S"/"N" · DEPTSINO</summary>
  [JsonPropertyName("deptsino")]
  public string Deptsino { get; set; } = string.Empty;

  /// <summary>Bandera multimoneda · BANDMULTI</summary>
  [JsonPropertyName("bandmulti")]
  public int Bandmulti { get; set; }

  /// <summary>Bandera ajuste por tipo de cambio · BANDAJT</summary>
  [JsonPropertyName("bandajt")]
  public int Bandajt { get; set; }

  // ── Jerarquía contable ───────────────────────────────────────
  /// <summary>Cuenta padre inmediata "000-000-000" · CTA_PAPA</summary>
  [JsonPropertyName("cta_Papa")]
  public string Cta_Papa { get; set; } = string.Empty;

  /// <summary>Cuenta raíz del grupo "000-000-000" · CTA_RAIZ</summary>
  [JsonPropertyName("cta_Raiz")]
  public string Cta_Raiz { get; set; } = string.Empty;

  /// <summary>Nivel jerárquico: 1=Mayor 2=Grupo 3=Detalle · NIVEL</summary>
  [JsonPropertyName("nivel")]
  public int Nivel { get; set; }

  /// <summary>Cuenta complementaria · CTA_COMP</summary>
  [JsonPropertyName("cta_Comp")]
  public int Cta_Comp { get; set; }

  /// <summary>"D"=Deudora "A"=Acreedora · NATURALEZA</summary>
  [JsonPropertyName("naturaleza")]
  public int Naturaleza { get; set; }

  // ── Datos fiscales ───────────────────────────────────────────
  /// <summary>RFC asociado a la cuenta · RFC</summary>
  [JsonPropertyName("rfc")]
  public string Rfc { get; set; } = string.Empty;

  /// <summary>Código de agrupación SAT · CODAGRUP</summary>
  [JsonPropertyName("codagrup")]
  public string Codagrup { get; set; } = string.Empty;

  /// <summary>Captura número de cheque · CAPTURACHEQUE</summary>
  [JsonPropertyName("capturaCheque")]
  public int CapturaCheque { get; set; }

  /// <summary>Captura UUID CFDI · CAPTURAUUID</summary>
  [JsonPropertyName("capturaUuid")]
  public int CapturaUuid { get; set; }

  // ── Datos bancarios ──────────────────────────────────────────
  /// <summary>Clave del banco · BANCO</summary>
  [JsonPropertyName("banco")]
  public int Banco { get; set; }

  /// <summary>Número de cuenta bancaria · CTABANCARIA</summary>
  [JsonPropertyName("ctaBancaria")]
  public string CtaBancaria { get; set; } = string.Empty;

  /// <summary>Tipo de movimiento para cheques · CAPCHEQTIPOMOV</summary>
  [JsonPropertyName("capcheqTipomov")]
  public string CapcheqTipomov { get; set; } = string.Empty;

  /// <summary>Excluir de XML · NOINCLUIRXML</summary>
  [JsonPropertyName("noIncluirXml")]
  public int NoIncluirXml { get; set; }

  /// <summary>ID fiscal · IDFISCAL</summary>
  [JsonPropertyName("idFiscal")]
  public string IdFiscal { get; set; } = string.Empty;

  /// <summary>Incluir en flujo de efectivo "S"/"N" · ESFLUJODEEFECTIVO</summary>
  [JsonPropertyName("esFlujodeEfectivo")]
  public string EsFlujodeEfectivo { get; set; } = string.Empty;

  /// <summary>Banco en el extranjero "S"/"N" · BANCOEXTRANJERO</summary>
  [JsonPropertyName("bancoExtranjero")]
  public string BancoExtranjero { get; set; } = string.Empty;

  /// <summary>RFC para flujo de efectivo · RFCFLUJO</summary>
  [JsonPropertyName("rfcFlujo")]
  public string RfcFlujo { get; set; } = string.Empty;
}


// ================================================================
//  SALDOS25
//  PK: NUM_CTA + EJERCICIO
//  IMPORTANTE: cada mes tiene 4 campos:
//    CARGO##   = cargos ordinarios del mes
//    ABONO##   = abonos ordinarios del mes
//    CARGOEX## = cargos extraordinarios del mes (≠ periodos 13/14)
//    ABONOEX## = abonos extraordinarios del mes
// ================================================================

public class Saldos
{
  // ── PK ───────────────────────────────────────────────────────
  /// <summary>Número de cuenta · NUM_CTA</summary>
  [JsonPropertyName("num_Cta")]
  public string Num_Cta { get; set; } = string.Empty;

  /// <summary>Año fiscal · EJERCICIO</summary>
  [JsonPropertyName("ejercicio")]
  public int Ejercicio { get; set; }

  // ── Saldos iniciales ─────────────────────────────────────────
  /// <summary>Saldo inicial ordinario al arranque del ejercicio · INICIAL</summary>
  [JsonPropertyName("inicial")]
  public double Inicial { get; set; }

  /// <summary>Saldo inicial extraordinario · INICIALEX</summary>
  [JsonPropertyName("inicialEx")]
  public double InicialEx { get; set; }

  // ── Enero ────────────────────────────────────────────────────
  [JsonPropertyName("cargo01")] public double Cargo01 { get; set; }
  [JsonPropertyName("abono01")] public double Abono01 { get; set; }

  // ── Febrero ──────────────────────────────────────────────────
  [JsonPropertyName("cargo02")] public double Cargo02 { get; set; }
  [JsonPropertyName("abono02")] public double Abono02 { get; set; }

  // ── Marzo ────────────────────────────────────────────────────
  [JsonPropertyName("cargo03")] public double Cargo03 { get; set; }
  [JsonPropertyName("abono03")] public double Abono03 { get; set; }

  // ── Abril ────────────────────────────────────────────────────
  [JsonPropertyName("cargo04")] public double Cargo04 { get; set; }
  [JsonPropertyName("abono04")] public double Abono04 { get; set; }

  // ── Mayo ─────────────────────────────────────────────────────
  [JsonPropertyName("cargo05")] public double Cargo05 { get; set; }
  [JsonPropertyName("abono05")] public double Abono05 { get; set; }

  // ── Junio ────────────────────────────────────────────────────
  [JsonPropertyName("cargo06")] public double Cargo06 { get; set; }
  [JsonPropertyName("abono06")] public double Abono06 { get; set; }

  // ── Julio ────────────────────────────────────────────────────
  [JsonPropertyName("cargo07")] public double Cargo07 { get; set; }
  [JsonPropertyName("abono07")] public double Abono07 { get; set; }

  // ── Agosto ───────────────────────────────────────────────────
  [JsonPropertyName("cargo08")] public double Cargo08 { get; set; }
  [JsonPropertyName("abono08")] public double Abono08 { get; set; }
  // ── Septiembre ───────────────────────────────────────────────
  [JsonPropertyName("cargo09")] public double Cargo09 { get; set; }
  [JsonPropertyName("abono09")] public double Abono09 { get; set; }

  // ── Octubre ──────────────────────────────────────────────────
  [JsonPropertyName("cargo10")] public double Cargo10 { get; set; }
  [JsonPropertyName("abono10")] public double Abono10 { get; set; }

  // ── Noviembre ────────────────────────────────────────────────
  [JsonPropertyName("cargo11")] public double Cargo11 { get; set; }
  [JsonPropertyName("abono11")] public double Abono11 { get; set; }

  // ── Diciembre ────────────────────────────────────────────────
  [JsonPropertyName("cargo12")] public double Cargo12 { get; set; }
  [JsonPropertyName("abono12")] public double Abono12 { get; set; }
}


// ================================================================
//  PRESUP25
//  PK: EJERCICIO + NUM_CTA
//  Incluye periodos 13 y 14 (asientos de cierre anual de Aspel COI)
// ================================================================

public class Presupuesto
{
  // ── PK ───────────────────────────────────────────────────────
  /// <summary>Año fiscal · EJERCICIO</summary>
  [JsonPropertyName("ejercicio")]
  public int Ejercicio { get; set; }

  /// <summary>Número de cuenta · NUM_CTA</summary>
  [JsonPropertyName("num_Cta")]
  public string Num_Cta { get; set; } = string.Empty;

  // ── Presupuesto mensual ──────────────────────────────────────
  [JsonPropertyName("presup01")] public double Presup01 { get; set; }
  [JsonPropertyName("presup02")] public double Presup02 { get; set; }
  [JsonPropertyName("presup03")] public double Presup03 { get; set; }
  [JsonPropertyName("presup04")] public double Presup04 { get; set; }
  [JsonPropertyName("presup05")] public double Presup05 { get; set; }
  [JsonPropertyName("presup06")] public double Presup06 { get; set; }
  [JsonPropertyName("presup07")] public double Presup07 { get; set; }
  [JsonPropertyName("presup08")] public double Presup08 { get; set; }
  [JsonPropertyName("presup09")] public double Presup09 { get; set; }
  [JsonPropertyName("presup10")] public double Presup10 { get; set; }
  [JsonPropertyName("presup11")] public double Presup11 { get; set; }
  [JsonPropertyName("presup12")] public double Presup12 { get; set; }

  // ── Periodos de cierre (Aspel COI) ───────────────────────────
  /// <summary>Periodo especial de cierre 13 · PRESUP13</summary>
  [JsonPropertyName("presup13")] public double Presup13 { get; set; }

  /// <summary>Periodo especial de cierre 14 · PRESUP14</summary>
  [JsonPropertyName("presup14")] public double Presup14 { get; set; }
}


// ================================================================
//  POLIZAS25  — Encabezado de póliza
//  PK: TIPO_POLI + NUM_POLIZ + PERIODO + EJERCICIO
//  Relación: POLIZAS25 (1) ──► AUXILIAR25 (N)
//            via TIPO_POLI + NUM_POLIZ + PERIODO + EJERCICIO
// ================================================================

public class Polizas
{
  // ── PK ───────────────────────────────────────────────────────
  /// <summary>"D"=Diario "I"=Ingresos "E"=Egresos · TIPO_POLI</summary>
  [JsonPropertyName("tipo_Poli")]
  public string Tipo_Poli { get; set; } = string.Empty;

  /// <summary>Folio consecutivo de la póliza · NUM_POLIZ</summary>
  [JsonPropertyName("num_Poliz")]
  public string Num_Poliz { get; set; } = string.Empty;

  /// <summary>Mes contable 1–14 (13 y 14 = cierre anual) · PERIODO</summary>
  [JsonPropertyName("periodo")]
  public int Periodo { get; set; }

  /// <summary>Año fiscal · EJERCICIO</summary>
  [JsonPropertyName("ejercicio")]
  public int Ejercicio { get; set; }

  // ── Encabezado ───────────────────────────────────────────────
  /// <summary>Fecha de la póliza ISO 8601 · FECHA_POL</summary>
  [JsonPropertyName("fecha_Pol")]
  public DateTime Fecha_Pol { get; set; }

  /// <summary>Concepto general de la póliza · CONCEP_PO</summary>
  [JsonPropertyName("concep_Po")]
  public string Concep_Po { get; set; } = string.Empty;

  /// <summary>Número total de partidas · NUM_PART</summary>
  [JsonPropertyName("num_Part")]
  public int Num_Part { get; set; }

  /// <summary>Log de auditoría · LOGAUDITA</summary>
  [JsonPropertyName("logAudita")]
  public string LogAudita { get; set; } = string.Empty;

  /// <summary>Póliza contabilizada "S"/"N" · CONTABILIZ</summary>
  [JsonPropertyName("contabiliz")]
  public string Contabiliz { get; set; } = string.Empty;

  /// <summary>Número de parcialidad · NUMPARCUA</summary>
  [JsonPropertyName("numParcua")]
  public int NumParcua { get; set; }

  /// <summary>Tiene documentos adjuntos · TIENEDOCUMENTOS</summary>
  [JsonPropertyName("tieneDocumentos")]
  public int TieneDocumentos { get; set; }

  /// <summary>Proceso de contabilización · PROCCONTAB</summary>
  [JsonPropertyName("procContab")]
  public int ProcContab { get; set; }

  /// <summary>"M"=Manual "A"=Automático "S"=Sistema · ORIGEN</summary>
  [JsonPropertyName("origen")]
  public string Origen { get; set; } = string.Empty;

  // ── CFDI / UUID ──────────────────────────────────────────────
  /// <summary>UUID del CFDI vinculado · UUID</summary>
  [JsonPropertyName("uuid")]
  public string Uuid { get; set; } = string.Empty;

  /// <summary>Póliza privada "S"/"N" · ESPOLIZAPRIVADA</summary>
  [JsonPropertyName("esPolizaPrivada")]
  public string EsPolizaPrivada { get; set; } = string.Empty;

  /// <summary>UUID de operación · UUIDOP</summary>
  [JsonPropertyName("uuidOp")]
  public string UuidOp { get; set; } = string.Empty;

  /// <summary>Documento SIGO · DOC_SIGO</summary>
  [JsonPropertyName("doc_Sigo")]
  public string Doc_Sigo { get; set; } = string.Empty;

  /// <summary>UUID del XML timbrado · UUIDXML</summary>
  [JsonPropertyName("uuidXml")]
  public string UuidXml { get; set; } = string.Empty;

  /// <summary>UUID de SAE · UUIDSAE</summary>
  [JsonPropertyName("uuidSae")]
  public string UuidSae { get; set; } = string.Empty;

  /// <summary>ID póliza EZAudita · ID_POL_EZAUDITA</summary>
  [JsonPropertyName("id_Pol_Ezaudita")]
  public string Id_Pol_Ezaudita { get; set; } = string.Empty;

  /// <summary>Sincronización EZAudita · SINC_EZAUDITA</summary>
  [JsonPropertyName("sinc_Ezaudita")]
  public int Sinc_Ezaudita { get; set; }

  // ── Partidas hijo (AUXILIAR25) ───────────────────────────────
  /// <summary>Líneas de detalle de la póliza — tabla AUXILIAR25</summary>
  [JsonPropertyName("partidas")]
  public List<Auxiliar> Auxiliares { get; set; } = [];
}


// ================================================================
//  AUXILIAR25  — Partidas / movimientos de cada póliza
//  PK: TIPO_POLI + NUM_POLIZ + NUM_PART + PERIODO + EJERCICIO
//  FK → POLIZAS25 via TIPO_POLI + NUM_POLIZ + PERIODO + EJERCICIO
//  FK → CUENTAS25 via NUM_CTA
// ================================================================

public class Auxiliar
{

  [JsonPropertyName("tipo_Poli")]
  public int Tipo_Poli { get; set; }

  [JsonPropertyName("num_Poliz")]
  public int Num_Poliz { get; set; }

  // ── PK parcial (los 4 campos del padre vienen en PolizaDto) ──
  /// <summary>Número de línea dentro de la póliza · NUM_PART</summary>
  [JsonPropertyName("num_Part")]
  public int Num_Part { get; set; }
  [JsonPropertyName("periodo")]
  public int Periodo { get; set; }

  /// <summary>Año fiscal · EJERCICIO</summary>
  [JsonPropertyName("ejercicio")]
  public int Ejercicio { get; set; }
  // ── Cuenta ───────────────────────────────────────────────────
  /// <summary>Cuenta contable afectada · NUM_CTA</summary>
  [JsonPropertyName("num_Cta")]
  public string Num_Cta { get; set; } = string.Empty;

  // ── Fecha / concepto de la partida ───────────────────────────
  /// <summary>Fecha exacta del movimiento ISO 8601 · FECHA_POL</summary>
  [JsonPropertyName("fecha_Pol")]
  public DateTime Fecha_Pol { get; set; }

  /// <summary>Concepto específico de la partida · CONCEP_PO</summary>
  [JsonPropertyName("concep_Po")]
  public string Concep_Po { get; set; } = string.Empty;

  // ── Movimiento ───────────────────────────────────────────────
  /// <summary>"D"=Debe (cargo) "H"=Haber (abono) · DEBE_HABER</summary>
  [JsonPropertyName("debe_Haber")]
  public string Debe_Haber { get; set; } = string.Empty;

  /// <summary>Importe del movimiento en moneda origen · MONTOMOV</summary>
  [JsonPropertyName("montoMov")]
  public double MontoMov { get; set; }

  /// <summary>Número de departamento · NUMDEPTO</summary>
  [JsonPropertyName("numDepto")]
  public int NumDepto { get; set; }

  /// <summary>Tipo de cambio (1.0 = MXN sin conversión) · TIPCAMBIO</summary>
  [JsonPropertyName("tipCambio")]
  public double TipCambio { get; set; }

  /// <summary>Cuenta contraparte · CONTRAPAR</summary>
  [JsonPropertyName("contrapar")]
  public int Contrapar { get; set; }

  /// <summary>Orden de captura dentro de la póliza · ORDEN</summary>
  [JsonPropertyName("orden")]
  public int Orden { get; set; }

  // ── Centros de costo / grupos ────────────────────────────────
  /// <summary>Centro de costos · CCOSTOS</summary>
  [JsonPropertyName("cCostos")]
  public string CCostos { get; set; } = string.Empty;

  /// <summary>Grupo contable · CGRUPOS</summary>
  [JsonPropertyName("cGrupos")]
  public string CGrupos { get; set; } = string.Empty;

  // ── Información adicional / CFDI ─────────────────────────────
  /// <summary>ID información adicional de la partida · IDINFADIPAR</summary>
  [JsonPropertyName("idInfAdipar")]
  public string IdInfAdipar { get; set; } = string.Empty;

  /// <summary>ID UUID vinculado a la partida · IDUUID</summary>
  [JsonPropertyName("idUuid")]
  public int IdUuid { get; set; }
}