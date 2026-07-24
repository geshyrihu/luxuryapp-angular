import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import {
  AspelBudgetDTO,
  CuentaAspelTercerNivelDTO,
} from "../interfaces/presupuesto-shared.models";
import { BudgetAccountRuleDataDTO } from "./presupuestos.interfaces";

export const ASPEL_AVAILABLE_YEARS: SelectItemDto[] = [
  { label: "2024", value: 2024 },
  { label: "2025", value: 2025 },
  { label: "2026", value: 2026 },
];

export const ASPEL_MONTHS: string[] = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export function isCuentaExtraordinaria(
  codigoCuenta: string,
  _customerId: string,
): boolean {
  return codigoCuenta.startsWith("605-");
}

export function isCuentaProyecto(
  codigoCuenta: string,
  _customerId: string,
): boolean {
  return codigoCuenta.startsWith("606-");
}

export function normalizeAspelAccounts(
  cuentas: CuentaAspelTercerNivelDTO[],
): CuentaAspelTercerNivelDTO[] {
  return cuentas.map((cuenta) => {
    const codigoCuenta = cuenta.codigo_Cuenta ?? cuenta.codigoCuenta ?? "";
    const descripcionCuenta =
      cuenta.descripcion_Cuenta ?? cuenta.descripcionCuenta ?? "";
    const cuentaPadre = cuenta.cuenta_Padre ?? cuenta.cuentaPadre ?? "";
    const nivelCuenta = cuenta.nivel_Cuenta ?? cuenta.nivelCuenta ?? 0;

    const monto_Enero = cuenta.monto_Enero ?? cuenta.eneroMonto ?? 0;
    const presup_Enero = cuenta.presup_Enero ?? cuenta.eneroPresupuesto ?? 0;
    const monto_Febrero = cuenta.monto_Febrero ?? cuenta.febreroMonto ?? 0;
    const presup_Febrero =
      cuenta.presup_Febrero ?? cuenta.febreroPresupuesto ?? 0;
    const monto_Marzo = cuenta.monto_Marzo ?? cuenta.marzoMonto ?? 0;
    const presup_Marzo = cuenta.presup_Marzo ?? cuenta.marzoPresupuesto ?? 0;
    const monto_Abril = cuenta.monto_Abril ?? cuenta.abrilMonto ?? 0;
    const presup_Abril = cuenta.presup_Abril ?? cuenta.abrilPresupuesto ?? 0;
    const monto_Mayo = cuenta.monto_Mayo ?? cuenta.mayoMonto ?? 0;
    const presup_Mayo = cuenta.presup_Mayo ?? cuenta.mayoPresupuesto ?? 0;
    const monto_Junio = cuenta.monto_Junio ?? cuenta.junioMonto ?? 0;
    const presup_Junio = cuenta.presup_Junio ?? cuenta.junioPresupuesto ?? 0;
    const monto_Julio = cuenta.monto_Julio ?? cuenta.julioMonto ?? 0;
    const presup_Julio = cuenta.presup_Julio ?? cuenta.julioPresupuesto ?? 0;
    const monto_Agosto = cuenta.monto_Agosto ?? cuenta.agostoMonto ?? 0;
    const presup_Agosto = cuenta.presup_Agosto ?? cuenta.agostoPresupuesto ?? 0;
    const monto_Septiembre =
      cuenta.monto_Septiembre ?? cuenta.septiembreMonto ?? 0;
    const presup_Septiembre =
      cuenta.presup_Septiembre ?? cuenta.septiembrePresupuesto ?? 0;
    const monto_Octubre = cuenta.monto_Octubre ?? cuenta.octubreMonto ?? 0;
    const presup_Octubre =
      cuenta.presup_Octubre ?? cuenta.octubrePresupuesto ?? 0;
    const monto_Noviembre =
      cuenta.monto_Noviembre ?? cuenta.noviembreMonto ?? 0;
    const presup_Noviembre =
      cuenta.presup_Noviembre ?? cuenta.noviembrePresupuesto ?? 0;
    const monto_Diciembre =
      cuenta.monto_Diciembre ?? cuenta.diciembreMonto ?? 0;
    const presup_Diciembre =
      cuenta.presup_Diciembre ?? cuenta.diciembrePresupuesto ?? 0;
    const acumulado_Anual = cuenta.acumulado_Anual ?? cuenta.anualAcumulado ?? 0;

    const parts = codigoCuenta.split("-");
    let esAgrupadora = false;
    let nivel = nivelCuenta || parts.length;

    if (parts.length === 3) {
      if (parts[1] === "000" && parts[2] === "000") {
        esAgrupadora = true;
        nivel = 1;
      } else if (parts[2] === "000") {
        esAgrupadora = true;
        nivel = 2;
      } else {
        nivel = 3;
      }
    }

    if (parts.length === 4) {
      if (parts[1] === "00" && parts[2] === "00" && parts[3] === "000") {
        esAgrupadora = true;
        nivel = 1;
      } else if (parts[2] === "00" && parts[3] === "000") {
        esAgrupadora = true;
        nivel = 2;
      } else if (parts[3] === "000") {
        esAgrupadora = true;
        nivel = 3;
      } else {
        nivel = 4;
      }
    }

    return {
      ...cuenta,
      codigo_Cuenta: codigoCuenta,
      descripcion_Cuenta: descripcionCuenta,
      cuenta_Padre: cuentaPadre,
      nivel_Cuenta: nivel,
      esFilaAgrupadora: esAgrupadora,
      monto_Enero,
      presup_Enero,
      monto_Febrero,
      presup_Febrero,
      monto_Marzo,
      presup_Marzo,
      monto_Abril,
      presup_Abril,
      monto_Mayo,
      presup_Mayo,
      monto_Junio,
      presup_Junio,
      monto_Julio,
      presup_Julio,
      monto_Agosto,
      presup_Agosto,
      monto_Septiembre,
      presup_Septiembre,
      monto_Octubre,
      presup_Octubre,
      monto_Noviembre,
      presup_Noviembre,
      monto_Diciembre,
      presup_Diciembre,
      acumulado_Anual,
    };
  });
}

export function getBudgetAccounts(
  budget: AspelBudgetDTO | null | undefined,
): CuentaAspelTercerNivelDTO[] {
  if (!budget) return [];
  return budget.cuentas ?? budget.cuentasDetalladas ?? [];
}

export function getBudgetCompanyName(
  budget: AspelBudgetDTO | null | undefined,
): string {
  if (!budget) return "";
  return budget.Nombre_Empresa ?? budget.nombreEmpresa ?? "";
}

export function normalizeAspelBudgetResponse(
  budget: AspelBudgetDTO | null | undefined,
): AspelBudgetDTO | null {
  if (!budget) return null;

  const cuentas = getBudgetAccounts(budget);
  const nombreEmpresa = getBudgetCompanyName(budget);

  return {
    ...budget,
    ID_Empresa: budget.ID_Empresa ?? budget.idEmpresa,
    Nombre_Empresa: budget.Nombre_Empresa ?? nombreEmpresa,
    ID_Periodo_presupuesto:
      budget.ID_Periodo_presupuesto ?? budget.idPeriodoPresupuesto,
    Periodo_Presupuesto:
      budget.Periodo_Presupuesto ?? budget.periodoPresupuesto,
    cuentas,
    cuentasDetalladas: budget.cuentasDetalladas ?? cuentas,
  };
}

export function splitAspelAccounts(
  cuentas: CuentaAspelTercerNivelDTO[],
  customerId: string,
  rules: BudgetAccountRuleDataDTO[] = [],
) {
  const normalizeAccountNumber = (value: string): string =>
    (value || "").trim().toLowerCase();

  const excludedAccountRules = new Set(
    rules
      .filter((rule) => rule.ruleType === 1)
      .map((rule) => normalizeAccountNumber(rule.accountNumber)),
  );

  const cuentasDisponibles = cuentas.filter(
    (cuenta) =>
      !excludedAccountRules.has(normalizeAccountNumber(cuenta.codigo_Cuenta)),
  );

  const isExtraordinaria = (cuenta: CuentaAspelTercerNivelDTO): boolean =>
    isCuentaExtraordinaria(cuenta.codigo_Cuenta, customerId);

  const isProyecto = (cuenta: CuentaAspelTercerNivelDTO): boolean =>
    !isExtraordinaria(cuenta) &&
    isCuentaProyecto(cuenta.codigo_Cuenta, customerId);

  const normalizeSpecialCategoryAccounts = (
    categoryAccounts: CuentaAspelTercerNivelDTO[],
  ): CuentaAspelTercerNivelDTO[] => {
    const accountCodesWithChildren = new Set(
      categoryAccounts.map((cuenta) => cuenta.cuenta_Padre).filter(Boolean),
    );

    return categoryAccounts.map((cuenta) => {
      if (!cuenta.esFilaAgrupadora) {
        return cuenta;
      }

      if (accountCodesWithChildren.has(cuenta.codigo_Cuenta)) {
        return cuenta;
      }

      // En especiales existen cuentas 605/606 de nivel 2 terminadas en 000
      // que llegan como hoja real aunque el formato parezca agrupador.
      return {
        ...cuenta,
        esFilaAgrupadora: false,
      };
    });
  };

  const extraordinarias = filterVisibleAccounts(
    normalizeSpecialCategoryAccounts(
      cuentasDisponibles.filter((cuenta) => isExtraordinaria(cuenta)),
    ),
  );
  const proyectos = filterVisibleAccounts(
    normalizeSpecialCategoryAccounts(
      cuentasDisponibles.filter((cuenta) => isProyecto(cuenta)),
    ),
  );
  const mantenimiento = filterVisibleAccounts(
    normalizeSpecialCategoryAccounts(
      cuentasDisponibles.filter(
        (cuenta) => !isExtraordinaria(cuenta) && !isProyecto(cuenta),
      ),
    ),
  );

  return {
    mantenimiento,
    extraordinarias,
    proyectos,
  };
}

export function filterVisibleAccounts(
  cuentas: CuentaAspelTercerNivelDTO[],
): CuentaAspelTercerNivelDTO[] {
  const visibleLeafAccounts = cuentas.filter((cuenta) => !cuenta.esFilaAgrupadora);
  const leafParentCodes = new Set(
    visibleLeafAccounts
      .map((cuenta) => cuenta.cuenta_Padre)
      .filter(Boolean),
  );
  const visibleSecondLevelAccounts = cuentas.filter(
    (cuenta) =>
      cuenta.nivel_Cuenta === 2 &&
      cuenta.esFilaAgrupadora &&
      leafParentCodes.has(cuenta.codigo_Cuenta),
  );
  const firstLevelChildParentCodes = new Set(
    visibleSecondLevelAccounts
      .map((cuenta) => cuenta.cuenta_Padre)
      .filter(Boolean),
  );

  return cuentas.filter((cuenta) => {
    if (cuenta.nivel_Cuenta === 1 && cuenta.esFilaAgrupadora) {
      return (
        firstLevelChildParentCodes.has(cuenta.codigo_Cuenta) ||
        leafParentCodes.has(cuenta.codigo_Cuenta)
      );
    }

    if (cuenta.nivel_Cuenta === 2 && cuenta.esFilaAgrupadora) {
      return leafParentCodes.has(cuenta.codigo_Cuenta);
    }

    return true;
  });
}

export function isParentAccount(cuenta: CuentaAspelTercerNivelDTO): boolean {
  return cuenta.esFilaAgrupadora;
}

export function getCuentaMonthValue(
  cuenta: CuentaAspelTercerNivelDTO,
  mes: string,
  prefix: "monto" | "presup",
): number {
  const monthKey =
    (prefix + "_" + mes.charAt(0).toUpperCase() + mes.slice(1)) as keyof CuentaAspelTercerNivelDTO;
  const value = cuenta[monthKey];
  return typeof value === "number" ? value : 0;
}

export function getPresupuestoBaseMensual(
  cuenta: CuentaAspelTercerNivelDTO,
): number {
  const monthKeys = [
    "presup_Enero",
    "presup_Febrero",
    "presup_Marzo",
    "presup_Abril",
    "presup_Mayo",
    "presup_Junio",
    "presup_Julio",
    "presup_Agosto",
    "presup_Septiembre",
    "presup_Octubre",
    "presup_Noviembre",
    "presup_Diciembre",
  ] as const;

  let vigente = 0;

  for (const monthKey of monthKeys) {
    const value = cuenta[monthKey];
    if (typeof value === "number" && !Number.isNaN(value)) {
      vigente = value;
    }
  }

  return vigente;
}

export function hasAnyExpense(
  cuenta: CuentaAspelTercerNivelDTO,
): boolean {
  return ASPEL_MONTHS.some((mes) => getCuentaMonthValue(cuenta, mes, "monto") !== 0);
}

export function hasAnyBudgetOrExpense(
  cuenta: CuentaAspelTercerNivelDTO,
): boolean {
  return ASPEL_MONTHS.some((mes) => {
    const monto = getCuentaMonthValue(cuenta, mes, "monto");
    const presupuesto = getCuentaMonthValue(cuenta, mes, "presup");
    return monto !== 0 || presupuesto !== 0;
  });
}
