import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SkeletonModule } from "primeng/skeleton";
import { TableModule } from "primeng/table";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";

import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import {
  IBaseAccountDto,
  IFinancialStatementDto,
} from "../../models/aspel-budget.interface";
import { AccountingNumberPipe } from "../../pipes/accounting-number.pipe";
import { reportFilterState } from "../../state/financial-report-filter.state";

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const MONTH_KEYS: (keyof IBaseAccountDto)[] = [
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

@Component({
  selector: "app-estado-resultados",
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    SkeletonModule,
    DataViewMobile,
    AccountingNumberPipe,
  ],
  templateUrl: "./estado-resultados.html",
})
export class EstadoResultados {
  private apiS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  public filterS = reportFilterState;

  // State
  loading = signal<boolean>(false);
  data = signal<IFinancialStatementDto | null>(null);

  monthHeaders = computed(() => {
    const idx = this.filterS.mesIdx(); // 0 a 11
    const wr = (i: number) => ((i % 12) + 12) % 12; // clamp circular
    return [
      MONTH_NAMES[wr(idx - 2)],
      MONTH_NAMES[wr(idx - 1)],
      MONTH_NAMES[wr(idx)],
    ];
  });

  rows = computed(() => {
    const d = this.data();
    const mes = this.filterS.mesIdx();
    if (!d) return [];

    const result: any[] = [];
    let totIng = [0, 0, 0, 0];
    let totGas = [0, 0, 0, 0];

    // Arrays separados para respetar el orden deseado en pantalla
    const ingRows: any[] = [];
    const gasRows: any[] = [];

    for (const clas of d.clasificaciones) {
      // ACREEDORA = Ingresos, DEUDORA = Gastos (convención COI)
      const esIngreso = clas.naturaleza?.toUpperCase() === "ACREEDORA";
      const destino = esIngreso ? ingRows : gasRows;

      for (const mayor of clas.cuentasMayor ?? []) {
        const wr = (i: number) => ((i % 12) + 12) % 12;
        const m1 = this.monto(mayor, wr(mes - 2));
        const m2 = this.monto(mayor, wr(mes - 1));
        const m3 = this.monto(mayor, mes);
        const acum = mayor.acumuladoAnual;

        if (!this.hasVisibleValues(m1, m2, m3, acum)) {
          continue;
        }

        destino.push({
          tipo: "item",
          numeroCuenta: mayor.numeroCuenta,
          descripcion: mayor.descripcion,
          mes1: m1,
          mes2: m2,
          mes3: m3,
          acum,
        });
        if (esIngreso) {
          totIng[0] += m1;
          totIng[1] += m2;
          totIng[2] += m3;
          totIng[3] += acum;
        } else {
          totGas[0] += m1;
          totGas[1] += m2;
          totGas[2] += m3;
          totGas[3] += acum;
        }
      }
    }

    // Sección INGRESOS
    result.push({ tipo: "header", descripcion: "INGRESOS" });
    result.push(...ingRows);
    result.push({
      tipo: "total-ingresos",
      descripcion: "TOTAL DE INGRESOS",
      mes1: totIng[0],
      mes2: totIng[1],
      mes3: totIng[2],
      acum: totIng[3],
    });

    // Sección GASTOS GENERALES
    result.push({ tipo: "header", descripcion: "GASTOS GENERALES" });
    result.push(...gasRows);
    result.push({
      tipo: "total-gastos",
      descripcion: "TOTAL DE GASTOS GENERALES",
      mes1: totGas[0],
      mes2: totGas[1],
      mes3: totGas[2],
      acum: totGas[3],
    });

    // Resultado del Periodo
    result.push({
      tipo: "diferencia",
      descripcion: "RESULTADO DEL PERIODO",
      mes1: totIng[0] - totGas[0],
      mes2: totIng[1] - totGas[1],
      mes3: totIng[2] - totGas[2],
      acum: totIng[3] - totGas[3],
    });

    return result;
  });

  constructor() {
    effect(() => {
      const custId = this.customerIdS.customerId();
      const yr = this.filterS.year();
      this.filterS.refreshTick();
      if (custId && yr) {
        this.loadData(custId, yr);
      }
    });
  }

  async loadData(customerId: string, year: number) {
    this.loading.set(true);
    this.data.set(null);
    const mes = this.filterS.mesIdx() + 1; // Backend expects 1-12
    const result = await this.apiS.onGetItem<IFinancialStatementDto>(
      Endpoints.ContabilidadOnline.FinancialStatements.incomeStatement(
        customerId,
        year,
        mes,
      ),
    );
    if (result) {
      this.data.set(result);
      this.filterS.currentReportName.set("Estado de Resultados");
      this.filterS.currentReportContext.set(JSON.stringify(result));
    }
    this.loading.set(false);
  }

  private monto(a: IBaseAccountDto, idx: number): number {
    return (a[MONTH_KEYS[idx % 12]] as number) ?? 0;
  }

  private hasVisibleValues(
    m1: number,
    m2: number,
    m3: number,
    acum: number,
  ): boolean {
    return m1 !== 0 || m2 !== 0 || m3 !== 0 || acum !== 0;
  }
}
