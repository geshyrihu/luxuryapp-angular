import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { AccountingNumberPipe } from "@shared/pipes/accounting-number.pipe";
import { LxSkeleton } from "@ui/adaptive/skeleton/skeleton";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";
import {
  IBaseAccountDto,
  IFinancialStatementDto,
} from "../../interfaces/aspel-budget.interface";
import { FinancialReportFilterStore } from "../state/financial-report-filter.store.service";

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

type EstadoResultadosRow =
  | { tipo: "header"; descripcion: string }
  | {
      tipo: "group" | "item" | "total-ingresos" | "total-gastos" | "diferencia";
      numeroCuenta?: string;
      descripcion: string;
      mes1: number;
      mes2: number;
      mes3: number;
      acum: number;
    };

@Component({
  selector: "app-resultados-extraordinarios",
  imports: [
    AppIcon,
    FormsModule,
    AppTable,
    LxSkeleton,
    DataViewMobile,
    AccountingNumberPipe,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./resultados-extraordinarios.html",
})
export class ResultadosExtraordinarios {
  private apiS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  public filterS = inject(FinancialReportFilterStore);

  loading = signal<boolean>(false);
  data = signal<IFinancialStatementDto | null>(null);

  monthHeaders = computed(() => {
    const idx = this.filterS.mesIdx();
    const wr = (i: number) => ((i % 12) + 12) % 12;
    return [
      MONTH_NAMES[wr(idx - 2)],
      MONTH_NAMES[wr(idx - 1)],
      MONTH_NAMES[wr(idx)],
    ];
  });

  rows = computed<EstadoResultadosRow[]>(() => {
    const d = this.data();
    const mes = this.filterS.mesIdx();
    if (!d) return [];

    const result: EstadoResultadosRow[] = [];
    const ingRows: EstadoResultadosRow[] = [];
    const gasRows: EstadoResultadosRow[] = [];
    let totIng = [0, 0, 0, 0];
    let totGas = [0, 0, 0, 0];
    const wr = (i: number) => ((i % 12) + 12) % 12;

    for (const clas of d.clasificaciones) {
      const esIngreso = clas.naturaleza?.toUpperCase() === "ACREEDORA";
      const destino = esIngreso ? ingRows : gasRows;

      for (const mayor of clas.cuentasMayor ?? []) {
        if (
          mayor.numeroCuenta !== "402-000-000" &&
          mayor.numeroCuenta !== "606-000-000"
        ) {
          continue;
        }
        const row = this.createRow("item", mayor, wr, mes);
        if (!this.hasVisibleValues(row)) {
          continue;
        }

        destino.push(row);

        if (esIngreso) totIng = this.addTotals(totIng, row);
        else totGas = this.addTotals(totGas, row);
      }
    }

    result.push({ tipo: "header", descripcion: "INGRESOS EXTRAORDINARIOS" });
    result.push(...ingRows);
    result.push({
      tipo: "total-ingresos",
      descripcion: "TOTAL DE INGRESOS EXTRAORDINARIOS",
      mes1: totIng[0],
      mes2: totIng[1],
      mes3: totIng[2],
      acum: totIng[3],
    });

    result.push({ tipo: "header", descripcion: "GASTOS EXTRAORDINARIOS" });
    result.push(...gasRows);
    result.push({
      tipo: "total-gastos",
      descripcion: "TOTAL DE GASTOS EXTRAORDINARIOS",
      mes1: totGas[0],
      mes2: totGas[1],
      mes3: totGas[2],
      acum: totGas[3],
    });

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
    const mes = this.filterS.mesIdx() + 1;
    const result = await this.apiS.onGetItem<IFinancialStatementDto>(
      Endpoints.ContabilidadOnline.FinancialStatements.incomeStatementV2(
        customerId,
        year,
        mes,
      ),
    );

    if (result) {
      this.data.set(result);
      this.filterS.currentReportName.set("Resultados Extraordinarios");
      this.filterS.currentReportContext.set(JSON.stringify(result));
    }

    this.loading.set(false);
  }

  private createRow(
    tipo: EstadoResultadosRow["tipo"],
    account: IBaseAccountDto,
    wr: (i: number) => number,
    mes: number,
  ): EstadoResultadosRow {
    return {
      tipo,
      numeroCuenta: account.numeroCuenta,
      descripcion: account.descripcion,
      mes1: this.monto(account, wr(mes - 2)),
      mes2: this.monto(account, wr(mes - 1)),
      mes3: this.monto(account, mes),
      acum: account.acumuladoAnual,
    };
  }

  private addTotals(totals: number[], row: EstadoResultadosRow): number[] {
    if (row.tipo === "header") return totals;

    return [
      totals[0] + row.mes1,
      totals[1] + row.mes2,
      totals[2] + row.mes3,
      totals[3] + row.acum,
    ];
  }

  private hasVisibleValues(row: EstadoResultadosRow): boolean {
    if (row.tipo === "header") return true;
    return row.mes1 !== 0 || row.mes2 !== 0 || row.mes3 !== 0 || row.acum !== 0;
  }

  private monto(a: IBaseAccountDto, idx: number): number {
    return (a[MONTH_KEYS[idx % 12]] as number) ?? 0;
  }
}
