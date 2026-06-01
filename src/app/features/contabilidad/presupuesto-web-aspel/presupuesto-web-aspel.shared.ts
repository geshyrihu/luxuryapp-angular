import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { CuentaAspelTercerNivelDTO } from "../models/presupuesto-shared.models";
import { BudgetAccountRuleDataDTO } from "./presupuestos.interfaces";

export const ASPEL_AVAILABLE_YEARS: ISelectItem[] = [
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
  return (
    codigoCuenta.startsWith("605-") || codigoCuenta.startsWith("607-")
  );
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
    const parts = (cuenta.codigo_Cuenta || "").split("-");
    let esAgrupadora = false;
    let nivel = cuenta.nivel_Cuenta || parts.length;

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
      esFilaAgrupadora: esAgrupadora,
      nivel_Cuenta: nivel,
    };
  });
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
