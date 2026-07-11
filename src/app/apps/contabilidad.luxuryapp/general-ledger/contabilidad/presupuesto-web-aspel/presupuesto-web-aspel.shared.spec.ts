import {
  ASPEL_MONTHS,
  filterVisibleAccounts,
  getCuentaMonthValue,
  getPresupuestoBaseMensual,
  hasAnyBudgetOrExpense,
  hasAnyExpense,
  normalizeAspelAccounts,
  splitAspelAccounts,
} from "./presupuesto-web-aspel.shared";
import { CuentaAspelTercerNivelDTO } from "../models/presupuesto-shared.models";
import { BudgetAccountRuleDataDTO } from "./presupuestos.interfaces";

describe("presupuesto-web-aspel.shared", () => {
  const createAccount = (
    partial: Partial<CuentaAspelTercerNivelDTO>,
  ): CuentaAspelTercerNivelDTO => ({
    codigo_Cuenta: "",
    descripcion_Cuenta: "",
    nivel_Cuenta: 0,
    cuenta_Padre: "",
    esFilaAgrupadora: false,
    monto_Enero: 0,
    presup_Enero: 0,
    monto_Febrero: 0,
    presup_Febrero: 0,
    monto_Marzo: 0,
    presup_Marzo: 0,
    monto_Abril: 0,
    presup_Abril: 0,
    monto_Mayo: 0,
    presup_Mayo: 0,
    monto_Junio: 0,
    presup_Junio: 0,
    monto_Julio: 0,
    presup_Julio: 0,
    monto_Agosto: 0,
    presup_Agosto: 0,
    monto_Septiembre: 0,
    presup_Septiembre: 0,
    monto_Octubre: 0,
    presup_Octubre: 0,
    monto_Noviembre: 0,
    presup_Noviembre: 0,
    monto_Diciembre: 0,
    presup_Diciembre: 0,
    acumulado_Anual: 0,
    anualAcumuladoPresupuesto: 0,
    anualAcumuladoMontoPresupuesto: 0,
    presupuestoAnual: 0,
    presupuestoRestante: 0,
    ...partial,
  });

  it("normalizes Aspel parent rows based on account shape", () => {
    const result = normalizeAspelAccounts([
      createAccount({ codigo_Cuenta: "600-000-000" }),
      createAccount({ codigo_Cuenta: "600-001-000" }),
      createAccount({ codigo_Cuenta: "600-001-001" }),
      createAccount({ codigo_Cuenta: "6000-00-00-000" }),
      createAccount({ codigo_Cuenta: "6000-01-00-000" }),
      createAccount({ codigo_Cuenta: "6000-01-01-000" }),
      createAccount({ codigo_Cuenta: "6000-01-01-001" }),
    ]);

    expect(result[0].esFilaAgrupadora).toBe(true);
    expect(result[0].nivel_Cuenta).toBe(1);
    expect(result[1].esFilaAgrupadora).toBe(true);
    expect(result[1].nivel_Cuenta).toBe(2);
    expect(result[2].esFilaAgrupadora).toBe(false);
    expect(result[2].nivel_Cuenta).toBe(3);
    expect(result[3].nivel_Cuenta).toBe(1);
    expect(result[4].nivel_Cuenta).toBe(2);
    expect(result[5].nivel_Cuenta).toBe(3);
    expect(result[6].esFilaAgrupadora).toBe(false);
    expect(result[6].nivel_Cuenta).toBe(4);
  });

  it("keeps only visible parent rows that have visible descendants", () => {
    const cuentas = [
      createAccount({
        codigo_Cuenta: "600-000-000",
        nivel_Cuenta: 1,
        esFilaAgrupadora: true,
      }),
      createAccount({
        codigo_Cuenta: "600-001-000",
        cuenta_Padre: "600-000-000",
        nivel_Cuenta: 2,
        esFilaAgrupadora: true,
      }),
      createAccount({
        codigo_Cuenta: "600-001-001",
        cuenta_Padre: "600-001-000",
        nivel_Cuenta: 3,
      }),
      createAccount({
        codigo_Cuenta: "601-000-000",
        nivel_Cuenta: 1,
        esFilaAgrupadora: true,
      }),
      createAccount({
        codigo_Cuenta: "601-001-000",
        cuenta_Padre: "601-000-000",
        nivel_Cuenta: 2,
        esFilaAgrupadora: true,
      }),
    ];

    const result = filterVisibleAccounts(cuentas);

    expect(result.map((x) => x.codigo_Cuenta)).toEqual([
      "600-000-000",
      "600-001-000",
      "600-001-001",
    ]);
  });

  it("splits maintenance, extraordinarias and proyectos and keeps 607 under presupuesto", () => {
    const cuentas = [
      createAccount({
        codigo_Cuenta: "600-001-001",
        descripcion_Cuenta: "Mantenimiento",
        cuenta_Padre: "600-001-000",
      }),
      createAccount({
        codigo_Cuenta: "605-001-001",
        descripcion_Cuenta: "Extra",
        cuenta_Padre: "605-001-000",
      }),
      createAccount({
        codigo_Cuenta: "606-001-001",
        descripcion_Cuenta: "Proyecto",
        cuenta_Padre: "606-001-000",
      }),
      createAccount({
        codigo_Cuenta: "607-001-001",
        descripcion_Cuenta: "Extra 2",
        cuenta_Padre: "607-001-000",
      }),
    ];

    const rules: BudgetAccountRuleDataDTO[] = [
      {
        id: "1",
        customerId: "customer",
        ruleType: 1,
        accountNumber: "600-999-999",
      },
    ];

    const result = splitAspelAccounts(cuentas, "customer", rules);

    expect(result.mantenimiento.map((x) => x.codigo_Cuenta)).toEqual([
      "600-001-001",
      "607-001-001",
    ]);
    expect(result.extraordinarias.map((x) => x.codigo_Cuenta)).toEqual([
      "605-001-001",
    ]);
    expect(result.proyectos.map((x) => x.codigo_Cuenta)).toEqual([
      "606-001-001",
    ]);
  });

  it("gets month values and preserves the current monthly budget fallback behavior", () => {
    const cuenta = createAccount({
      monto_Enero: 50,
      presup_Enero: 100,
      presup_Febrero: 0,
      presup_Marzo: 150,
      presup_Abril: 0,
    });

    expect(getCuentaMonthValue(cuenta, "enero", "monto")).toBe(50);
    expect(getCuentaMonthValue(cuenta, "enero", "presup")).toBe(100);
    expect(getPresupuestoBaseMensual(cuenta)).toBe(0);
  });

  it("detects any expense across Aspel months", () => {
    const sinGasto = createAccount({});
    const conGasto = createAccount({ monto_Agosto: 25 });

    expect(ASPEL_MONTHS.length).toBe(12);
    expect(hasAnyExpense(sinGasto)).toBe(false);
    expect(hasAnyExpense(conGasto)).toBe(true);
  });

  it("detects cuentas with budget or expense across Aspel months", () => {
    const sinMovimientoNiPresupuesto = createAccount({});
    const conPresupuesto = createAccount({ presup_Mayo: 100 });
    const conGasto = createAccount({ monto_Agosto: 25 });

    expect(hasAnyBudgetOrExpense(sinMovimientoNiPresupuesto)).toBe(false);
    expect(hasAnyBudgetOrExpense(conPresupuesto)).toBe(true);
    expect(hasAnyBudgetOrExpense(conGasto)).toBe(true);
  });
});
