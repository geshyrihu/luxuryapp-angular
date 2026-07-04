import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SelectModule } from "primeng/select";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ChartWrapper } from "src/app/core/components/web/charts/chart-wrapper";

import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import {
  IAnalisisCobranzaOnlineDto,
  ICobranzaOnlineAnalysisCondominoDto,
} from "../../models/aspel-budget.interface";
import { AccountingNumberPipe } from "../../pipes/accounting-number.pipe";
import { reportFilterState } from "../../state/financial-report-filter.state";

@Component({
  selector: "app-analisis-cobranza",
  imports: [
    CommonModule,
    FormsModule,
    ChartWrapper,
    SelectModule,
    TableModule,
    TagModule,
    AccountingNumberPipe,
  ],
  templateUrl: "./analisis-cobranza.html",
})
export class AnalisisCobranza {
  private readonly apiS = inject(ApiResponseService);
  private readonly customerIdS = inject(CustomerIdService);
  readonly filterS = reportFilterState;

  readonly loading = signal(false);
  readonly selectedClassification = signal("TODAS");
  readonly data = signal<IAnalisisCobranzaOnlineDto | null>(null);
  readonly cutoffDateInput = signal("");

  readonly hasCustomer = computed(() => !!this.customerIdS.customerId());

  readonly classificationOptions = [
    "TODAS",
    "COBRANZA JUDICIAL",
    "MOROSOS",
    "DEUDA CORRIENTE",
    "SIN ADEUDO",
  ];

  readonly chartData = computed(() => {
    const analysis = this.data();
    if (!analysis) return null;

    return {
      labels: ["Morosos", "Deuda Corriente", "Cobrado"],
      datasets: [
        {
          data: [
            analysis.totalMorosos,
            analysis.totalDeudaCorriente,
            analysis.totalCobrado,
          ],
          backgroundColor: ["#dc2626", "#f59e0b", "#22c55e"],
          hoverBackgroundColor: ["#dc2626", "#f59e0b", "#22c55e"],
          borderWidth: 0,
        },
      ],
    };
  });

  readonly chartOptions = {
    plugins: { legend: { position: "bottom" } },
    responsive: true,
    maintainAspectRatio: false,
  };

  readonly filteredRows = computed<
    ICobranzaOnlineAnalysisCondominoDto[]
  >(() => {
    const analysis = this.data();
    if (!analysis) {
      return [];
    }

    switch (this.selectedClassification()) {
      case "COBRANZA JUDICIAL":
        return analysis.cobranzaJudicial;
      case "MOROSOS":
        return analysis.morosos;
      case "DEUDA CORRIENTE":
        return analysis.deudaCorriente;
      case "SIN ADEUDO":
        return analysis.sinAdeudo;
      default:
        return [
          ...analysis.cobranzaJudicial,
          ...analysis.morosos,
          ...analysis.deudaCorriente,
        ];
    }
  });

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      const year = this.filterS.year();
      const month = this.filterS.mesIdx() + 1;
      this.filterS.refreshTick();

      if (!customerId) {
        this.data.set(null);
        return;
      }

      const day = this.getLastDayOfMonth(year, month);
      this.cutoffDateInput.set(
        `${year}-${`${month}`.padStart(2, "0")}-${`${day}`.padStart(2, "0")}`,
      );
      void this.loadData(customerId, this.cutoffDateInput());
    });
  }

  pct(value: number, total: number) {
    if (!total) {
      return "0%";
    }

    return `${((value / total) * 100).toFixed(1)}%`;
  }

  getSeverity(clasificacion: string) {
    switch (clasificacion) {
      case "COBRANZA JUDICIAL":
        return "danger";
      case "MOROSOS":
        return "danger";
      case "DEUDA CORRIENTE":
        return "warning";
      case "SIN ADEUDO":
        return "success";
      case "ANTICIPOS":
        return "info";
      default:
        return "secondary";
    }
  }

  readonly uniqueConcepts = computed(() => {
    const rows = this.filteredRows();
    const concepts = new Set<string>();
    for (const row of rows) {
      if (row.desglose) {
        for (const item of row.desglose) {
          concepts.add(item.concepto);
        }
      }
    }
    return Array.from(concepts).sort();
  });

  get summaryRows() {
    return [...this.filteredRows()].sort((a, b) => b.saldo - a.saldo);
  }

  getConceptBalance(row: ICobranzaOnlineAnalysisCondominoDto, concepto: string) {
    if (!row.desglose) return 0;
    const item = row.desglose.find(d => d.concepto === concepto);
    return item ? item.saldoFinal : 0;
  }

  getTotalConceptBalance(concepto: string) {
    let total = 0;
    const rows = this.filteredRows();
    for (const row of rows) {
      total += this.getConceptBalance(row, concepto);
    }
    return total;
  }

  get totalFilteredSaldo() {
    return this.filteredRows().reduce((acc, curr) => acc + curr.saldo, 0);
  }

  private getLastDayOfMonth(year: number, month: number) {
    return new Date(year, month, 0).getDate();
  }

  private async loadData(customerId: string, cutoffDateInput: string) {
    const cutoffDate = new Date(`${cutoffDateInput}T12:00:00`);

    if (Number.isNaN(cutoffDate.getTime())) {
      this.data.set(null);
      return;
    }

    const year = cutoffDate.getFullYear();
    const month = cutoffDate.getMonth() + 1;
    const day = cutoffDate.getDate();

    this.loading.set(true);
    const result = await this.apiS.onGetItem<IAnalisisCobranzaOnlineDto>(
      Endpoints.ContabilidadOnline.FinancialStatements.collectionAnalysisOnline(
        customerId,
        year,
        month,
        day,
      ),
      false,
    );

    if (result) {
      this.data.set(result);
      this.filterS.currentReportName.set("Análisis de Cobranza");
      this.filterS.currentReportContext.set(JSON.stringify(result));
    } else {
      this.data.set(null);
    }

    this.loading.set(false);
  }
}
