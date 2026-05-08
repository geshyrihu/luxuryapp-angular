import { CommonModule, DecimalPipe } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { ChartModule } from "primeng/chart";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";

import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { IAnalisisCobranzaDto } from "../../models/aspel-budget.interface";
import { ReportFilterService } from "../../services/financial-report-filter.service";

@Component({
  selector: "app-analisis-cobranza",
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CustomButton,
    DecimalPipe,
    SelectModule,
    InputTextModule,
    ChartModule,
    TagModule,
  ],
  templateUrl: "./analisis-cobranza.html",
})
export class AnalisisCobranza {
  private apiS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  public filterS = inject(ReportFilterService);

  // State
  loading = signal<boolean>(false);
  data = signal<IAnalisisCobranzaDto | null>(null);
  year = signal<number>(new Date().getFullYear());
  selectedMonthIdx = signal<number>(new Date().getMonth() + 1);
  cuotaMensual = signal<number>(0);
  filtroClasif = signal<string>("TODAS");

  readonly clasificaciones = [
    "TODAS",
    "COBRANZA JUDICIAL",
    "MOROSOS",
    "DEUDA CORRIENTE",
    "SIN ADEUDO",
    "ANTICIPOS",
  ];

  monthOptions = [
    { label: "Enero", value: 1 },
    { label: "Febrero", value: 2 },
    { label: "Marzo", value: 3 },
    { label: "Abril", value: 4 },
    { label: "Mayo", value: 5 },
    { label: "Junio", value: 6 },
    { label: "Julio", value: 7 },
    { label: "Agosto", value: 8 },
    { label: "Septiembre", value: 9 },
    { label: "Octubre", value: 10 },
    { label: "Noviembre", value: 11 },
    { label: "Diciembre", value: 12 },
  ];

  chartOptions = {
    plugins: { legend: { position: "bottom" } },
    responsive: true,
    maintainAspectRatio: false,
  };

  // Computed requeridos por el HTML
  chartData = computed(() => {
    const d = this.data();
    if (!d) return null;
    const cuota = this.cuotaMensual();

    if (cuota > 0) {
      const totalPerfecto = d.totalCondominios * cuota;
      const cobrado = Math.max(
        0,
        totalPerfecto - d.totalMorosos - d.totalDeudaCorriente,
      );
      return {
        labels: ["Cobrado", "Morosos", "Deuda Corriente"],
        datasets: [
          {
            data: [cobrado, d.totalMorosos, d.totalDeudaCorriente],
            backgroundColor: ["#22c55e", "#f59e0b", "#3b82f6"],
          },
        ],
      };
    }

    return {
      labels: ["Cobranza Judicial", "Morosos", "Deuda Corriente"],
      datasets: [
        {
          data: [d.totalJudicial, d.totalMorosos, d.totalDeudaCorriente],
          backgroundColor: ["#ef4444", "#f59e0b", "#3b82f6"],
        },
      ],
    };
  });

  condominosFiltrados = computed(() => {
    const d = this.data();
    if (!d) return [];
    switch (this.filtroClasif()) {
      case "COBRANZA JUDICIAL":
        return d.cobranzaJudicial;
      case "MOROSOS":
        return d.morosos;
      case "DEUDA CORRIENTE":
        return d.deudaCorriente;
      case "SIN ADEUDO":
        return d.sinAdeudo;
      case "ANTICIPOS":
        return d.anticipos;
      default:
        return [
          ...d.cobranzaJudicial,
          ...d.morosos,
          ...d.deudaCorriente,
          ...d.sinAdeudo,
          ...d.anticipos,
        ];
    }
  });

  constructor() {
    effect(() => {
      const custId = this.customerIdS.customerId();
      const yr = this.year();
      const month = this.selectedMonthIdx();
      if (custId && yr && month) {
        this.loadData(custId, yr, month);
      }
    });
  }

  pct(value: number, total: number): string {
    if (!total) return "0%";
    return ((value / total) * 100).toFixed(1) + "%";
  }

  getSeverity(clasificacion: string): string {
    switch (clasificacion) {
      case "COBRANZA JUDICIAL":
        return "danger";
      case "MOROSOS":
        return "warn";
      case "DEUDA CORRIENTE":
        return "info";
      case "SIN ADEUDO":
        return "success";
      case "ANTICIPOS":
        return "secondary";
      default:
        return "secondary";
    }
  }

  onMonthChange(month: number) {
    this.selectedMonthIdx.set(month);
  }

  onLoad() {
    const custId = this.customerIdS.customerId();
    if (custId) {
      this.loadData(custId, this.year(), this.selectedMonthIdx());
    }
  }

  async loadData(customerId: string, year: number, month: number) {
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      return;
    }

    this.loading.set(true);
    const result = await this.apiS.onGetItem<IAnalisisCobranzaDto>(
      Endpoints.ContabilidadOnline.FinancialStatements.collectionAnalysis(
        customerId,
        year,
        month,
      ),
    );
    if (result) {
      this.data.set(result);
      this.filterS.currentReportName.set('Análisis de Cobranza');
      this.filterS.currentReportContext.set(JSON.stringify(result));
    }
    this.loading.set(false);
  }
}
