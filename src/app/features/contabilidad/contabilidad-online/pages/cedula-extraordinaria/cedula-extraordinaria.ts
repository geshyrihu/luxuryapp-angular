import { CommonModule, DecimalPipe } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SkeletonModule } from "primeng/skeleton";
import { TableModule } from "primeng/table";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import {
  IBaseAccountDto,
  ICedulaExtraordinariaDto,
  ICuentaMayorDto,
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

type ReportRow = {
  tipo: "header" | "item" | "total";
  descripcion: string;
  numeroCuenta?: string;
  mes1?: number;
  mes2?: number;
  mes3?: number;
  acum?: number;
};

@Component({
  selector: "app-cedula-extraordinaria",
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    SkeletonModule,
    DataViewMobile,
    DecimalPipe,
    AccountingNumberPipe,
  ],
  templateUrl: "./cedula-extraordinaria.html",
})
export class CedulaExtraordinaria {
  private apiS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  public filterS = reportFilterState;

  loading = signal<boolean>(false);
  data = signal<ICedulaExtraordinariaDto | null>(null);

  monthHeaders = computed(() => {
    const idx = this.filterS.mesIdx();
    const wr = (i: number) => ((i % 12) + 12) % 12;
    return [
      MONTH_NAMES[wr(idx - 2)],
      MONTH_NAMES[wr(idx - 1)],
      MONTH_NAMES[idx],
    ];
  });

  mainRows = computed<ReportRow[]>(() => {
    const d = this.data();
    const mes = this.filterS.mesIdx();
    if (!d) return [];

    const rows: ReportRow[] = [];
    const ingresos = (d.recaudadoMejoras ?? []).filter((row) =>
      this.hasVisibleValues(row),
    );
    const gastos = (d.gastosMejoras ?? []).filter((row) =>
      this.hasVisibleValues(row),
    );

    if (ingresos.length > 0) {
      rows.push({ tipo: "header", descripcion: "RECAUDADO MEJORAS" });
      rows.push(...ingresos.map((row) => this.toRow(row, mes)));
      rows.push(this.toTotalRow(d.totalRecaudadoMejoras, mes));
    }

    if (gastos.length > 0) {
      rows.push({ tipo: "header", descripcion: "GASTOS MEJORAS Y EVENTOS" });
      rows.push(...gastos.map((row) => this.toRow(row, mes)));
      rows.push(this.toTotalRow(d.totalGastosMejoras, mes));
    }

    return rows;
  });

  extraRows = computed<ReportRow[]>(() => {
    const d = this.data();
    const mes = this.filterS.mesIdx();
    if (!d) return [];

    const gastos = (d.gastosExtraordinarios ?? []).filter((row) =>
      this.hasVisibleValues(row),
    );
    if (gastos.length === 0) return [];

    return [
      { tipo: "header", descripcion: "GASTOS EXTRAORDINARIOS" },
      ...gastos.map((row) => this.toRow(row, mes)),
      this.toTotalRow(d.totalGastosExtraordinarios, mes),
    ];
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
    const mes = this.filterS.mesIdx() + 1;
    const result = await this.apiS.onGetItem<ICedulaExtraordinariaDto>(
      Endpoints.ContabilidadOnline.FinancialStatements.extraordinaryFeeSchedule(
        customerId,
        year,
        mes,
      ),
    );

    if (result) {
      this.data.set(result);
      this.filterS.currentReportName.set("Cédula de Cuotas Extraordinarias");
      this.filterS.currentReportContext.set(JSON.stringify(result));
    }

    this.loading.set(false);
  }

  private toRow(account: ICuentaMayorDto, mes: number): ReportRow {
    const wr = (i: number) => ((i % 12) + 12) % 12;
    return {
      tipo: "item",
      numeroCuenta: account.numeroCuenta,
      descripcion: account.descripcion,
      mes1: this.monto(account, wr(mes - 2)),
      mes2: this.monto(account, wr(mes - 1)),
      mes3: this.monto(account, mes),
      acum: account.acumuladoAnual,
    };
  }

  private toTotalRow(account: ICuentaMayorDto, mes: number): ReportRow {
    const wr = (i: number) => ((i % 12) + 12) % 12;
    return {
      tipo: "total",
      descripcion: account.descripcion,
      mes1: this.monto(account, wr(mes - 2)),
      mes2: this.monto(account, wr(mes - 1)),
      mes3: this.monto(account, mes),
      acum: account.acumuladoAnual,
    };
  }

  private monto(account: IBaseAccountDto, idx: number): number {
    return (account[MONTH_KEYS[idx % 12]] as number) ?? 0;
  }

  private hasVisibleValues(account: IBaseAccountDto): boolean {
    return (
      account.montoEnero !== 0 ||
      account.montoFebrero !== 0 ||
      account.montoMarzo !== 0 ||
      account.montoAbril !== 0 ||
      account.montoMayo !== 0 ||
      account.montoJunio !== 0 ||
      account.montoJulio !== 0 ||
      account.montoAgosto !== 0 ||
      account.montoSeptiembre !== 0 ||
      account.montoOctubre !== 0 ||
      account.montoNoviembre !== 0 ||
      account.montoDiciembre !== 0 ||
      account.acumuladoAnual !== 0
    );
  }
}
