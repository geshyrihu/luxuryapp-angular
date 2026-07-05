import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal, input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";

import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import {
  IBaseAccountDto,
  IFinancialStatementDto,
} from "../../models/aspel-budget.interface";
import { AccountingNumberPipe } from "../../pipes/accounting-number.pipe";
import { reportFilterState } from "../../state/financial-report-filter.state";

/** Nombres de meses para los encabezados de columnas */
const MONTH_NAMES = [
  "ENE",
  "FEB",
  "MAR",
  "ABR",
  "MAY",
  "JUN",
  "JUL",
  "AGO",
  "SEP",
  "OCT",
  "NOV",
  "DIC",
];

/** Claves de monto mensual en orden enero-diciembre */
const MONTO_KEYS: (keyof IBaseAccountDto)[] = [
  "montoEnero",
  "montoFebrero",
  "montoMarzo",
  "montoAbril",
  "montoMayo",
  "montoJunio",
  "montoJulio",
  "montoAgosto",
  "montoSeptiembre",
  "montoOctubre",
  "montoNoviembre",
  "montoDiciembre",
];

/** Claves de presupuesto mensual en orden enero-diciembre */
const PRESUP_KEYS: (keyof IBaseAccountDto)[] = [
  "presupEnero",
  "presupFebrero",
  "presupMarzo",
  "presupAbril",
  "presupMayo",
  "presupJunio",
  "presupJulio",
  "presupAgosto",
  "presupSeptiembre",
  "presupOctubre",
  "presupNoviembre",
  "presupDiciembre",
];

/**
 * Cuentas que pertenecen a "Gastos Generales" (bloque principal).
 * 605, 606, 607 se separan en su propio bloque al final del reporte.
 */
const GASTOS_GENERALES = [
  "600-",
  "601-",
  "602-",
  "603-",
  "604-",
  "607-",
  "608-",
  "609-",
];
const GASTOS_EXTRA = ["605-"];

@Component({
  selector: "app-cedula-presupuestal",
  imports: [CommonModule, FormsModule, TableModule, AccountingNumberPipe],
  templateUrl: "./cedula-presupuestal.html",
})
export class CedulaPresupuestal {
  private apiS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  public filterS = reportFilterState;

  // Estado
  loading = signal<boolean>(false);
  data = signal<IFinancialStatementDto | null>(null);

  /**
   * Encabezados dinámicos de las columnas de meses.
   * Muestra la ventana: mes-2, mes-1, mes actual.
   */
  monthHeaders = computed(() => {
    const idx = this.filterS.mesIdx(); // 0 a 11
    const wr = (i: number) => ((i % 12) + 12) % 12;
    return [
      MONTH_NAMES[wr(idx - 2)],
      MONTH_NAMES[wr(idx - 1)],
      MONTH_NAMES[wr(idx)],
    ];
  });

  /**
   * Construye el array de filas con tipos específicos para la tabla:
   * - header: banda azul oscuro de tótulo de sección
   * - item: renglón de cuenta mayor
   * - total-seccion: total de un grupo (Gastos de Personal, etc.)
   * - gran-total: gran total de Gastos Generales
   * - total-extra: total de cada bloque extraordinario
   */
  rows = computed(() => {
    const d = this.data();
    const idx = this.filterS.mesIdx(); // 0-based
    if (!d) return [];

    // Función auxiliar para ajuste circular de óndice
    const wr = (i: number) => ((i % 12) + 12) % 12;

    // Obtiene el monto de un mes específico para una cuenta
    const getMonto = (cuenta: IBaseAccountDto, mesIdx: number): number =>
      (cuenta[MONTO_KEYS[mesIdx]] as number) ?? 0;

    // Obtiene el presupuesto de un mes específico para una cuenta
    const getPresup = (cuenta: IBaseAccountDto, mesIdx: number): number =>
      (cuenta[PRESUP_KEYS[mesIdx]] as number) ?? 0;

    // Presupuesto anual = suma de los 12 meses de presupuesto
    const getPresupAnual = (cuenta: IBaseAccountDto): number =>
      PRESUP_KEYS.reduce((s, k) => s + ((cuenta[k] as number) ?? 0), 0);

    const result: any[] = [];

    // Separar cuentas por su clasificación (General vs Extraordinario)
    const todasLasCuentas = d.clasificaciones.flatMap(
      (c) => c.cuentasMayor ?? [],
    );
    const cuentasGenerales = todasLasCuentas.filter(
      (c) =>
        GASTOS_GENERALES.some((prefix) => c.numeroCuenta.startsWith(prefix)) &&
        c.numeroCuenta !== "600-000-000",
    );
    const cuentasExtra = todasLasCuentas.filter((c) =>
      GASTOS_EXTRA.some((prefix) => c.numeroCuenta.startsWith(prefix)),
    );

    const buildRow = (cuenta: IBaseAccountDto) => {
      const presupMes = getPresup(cuenta, idx);
      const oct = getMonto(cuenta, wr(idx - 2));
      const nov = getMonto(cuenta, wr(idx - 1));
      const mes = getMonto(cuenta, idx);
      const acum = cuenta.acumuladoAnual;
      const presupAnual = getPresupAnual(cuenta);
      const restante = presupAnual - acum;

      return {
        tipo: "item",
        numeroCuenta: cuenta.numeroCuenta,
        descripcion: cuenta.descripcion,
        presupMes,
        oct,
        nov,
        mes,
        acum,
        presupAnual,
        restante,
      };
    };

    const appendSection = (
      descripcion: string,
      cuentas: IBaseAccountDto[],
      totalDescripcion: string,
    ) => {
      if (!cuentas.length) return;

      let total = {
        presupMes: 0,
        oct: 0,
        nov: 0,
        mes: 0,
        acum: 0,
        presupAnual: 0,
      };

      result.push({ tipo: "header", descripcion, colspan: 7 });

      for (const cuenta of cuentas) {
        const row = buildRow(cuenta);
        total.presupMes += row.presupMes;
        total.oct += row.oct;
        total.nov += row.nov;
        total.mes += row.mes;
        total.acum += row.acum;
        total.presupAnual += row.presupAnual;
        result.push(row);
      }

      result.push({
        tipo: "total-extra",
        descripcion: totalDescripcion,
        presupMes: total.presupMes,
        oct: total.oct,
        nov: total.nov,
        mes: total.mes,
        acum: total.acum,
        presupAnual: total.presupAnual,
        restante: total.presupAnual - total.acum,
      });
    };

    // --- BLOQUE 1: GASTOS GENERALES -------------------------------------------
    let granTot = {
      presupMes: 0,
      oct: 0,
      nov: 0,
      mes: 0,
      acum: 0,
      presupAnual: 0,
    };

    if (cuentasGenerales.length) {
      result.push({
        tipo: "header",
        descripcion: "GASTOS GENERALES",
        colspan: 7,
      });
    }

    for (const cuenta of cuentasGenerales) {
      const presupMes = getPresup(cuenta, idx);
      const oct = getMonto(cuenta, wr(idx - 2));
      const nov = getMonto(cuenta, wr(idx - 1));
      const mes = getMonto(cuenta, idx);
      const acum = cuenta.acumuladoAnual;
      const presupAnual = getPresupAnual(cuenta);
      const restante = presupAnual - acum;

      granTot.presupMes += presupMes;
      granTot.oct += oct;
      granTot.nov += nov;
      granTot.mes += mes;
      granTot.acum += acum;
      granTot.presupAnual += presupAnual;

      result.push(buildRow(cuenta));
    }

    if (cuentasGenerales.length) {
      result.push({
        tipo: "gran-total",
        descripcion: "GRAN TOTAL GASTOS GENERALES",
        presupMes: granTot.presupMes,
        oct: granTot.oct,
        nov: granTot.nov,
        mes: granTot.mes,
        acum: granTot.acum,
        presupAnual: granTot.presupAnual,
        restante: granTot.presupAnual - granTot.acum,
      });
    }

    appendSection(
      "EXTRAORDINARIOS",
      cuentasExtra.filter((c) => c.numeroCuenta.startsWith("605-")),
      "TOTAL EXTRAORDINARIOS",
    );

    return result;
  });

  constructor() {
    effect(() => {
      const custId = this.customerIdS.customerId();
      const yr = this.filterS.year();
      const mes = this.filterS.mesIdx() + 1; // Backend espera 1-12
      this.filterS.refreshTick();
      if (custId && yr) {
        this.loadData(custId, yr, mes);
      }
    });
  }

  /** Carga los datos del reporte desde el API */
  async loadData(customerId: string, year: number, mes: number) {
    this.loading.set(true);
    this.data.set(null);
    const result = await this.apiS.onGetItem<IFinancialStatementDto>(
      Endpoints.ContabilidadOnline.FinancialStatements.budgetVsActual(
        customerId,
        year,
        mes,
      ),
    );
    if (result) {
      this.data.set(result);
      this.filterS.currentReportName.set("Códula Presupuestal vs Gastos");
      this.filterS.currentReportContext.set(JSON.stringify(result));
    }
    this.loading.set(false);
  }
}
