import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { ButtonModule } from "primeng/button";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { ChartWrapper } from "@ui/web/charts/chart-wrapper";

import { MessageModule } from "primeng/message";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import type { CobranzaOnlineAnalysisResponse } from "../../models/cobranza-online-analysis.model";

function buildTodayInputValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

@Component({
  selector: "app-cobranza-online-analysis",
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    MessageModule,
    CustomInputSelectSignal,
    TableModule,
    TagModule,
    DataViewMobile,
    IonItem,
    IonLabel,
    WebButtonLabel,
    ChartWrapper,
  ],
  templateUrl: "./cobranza-online-analysis.html",
})
export class CobranzaOnlineAnalysis {
  private router = inject(Router);
  private customerIdS = inject(CustomerIdService);
  private apiResponseS = inject(ApiResponseService);

  readonly loading = signal(false);
  readonly cutoffDateInput = signal(buildTodayInputValue());
  readonly selectedClassification = signal("TODAS");
  readonly data = signal<CobranzaOnlineAnalysisResponse | null>(null);
  readonly hasCustomer = computed(() => !!this.customerIdS.customerId());
  readonly customerName = computed(() => this.customerIdS.customerName());

  readonly classificationOptions = [
    "TODAS",
    "COBRANZA JUDICIAL",
    "MOROSOS",
    "DEUDA CORRIENTE",
    "SIN ADEUDO",
    "ANTICIPOS",
  ];

  readonly globalFilterFields = computed(() => [
    "numeroCuenta",
    "condomino",
    "clasificacion",
  ]);

  readonly messageSeverity = computed(() =>
    this.data()?.syncMetadata?.dataSource === "aspel-live" ? "success" : "warn",
  );

  readonly chartData = computed(() => {
    const analysis = this.data();
    if (!analysis) {
      return null;
    }

    if (analysis.cobranzaPerfecta > 0) {
      return {
        labels: ["Morosos", "Deuda Corriente", "Cobrado"],
        datasets: [
          {
            data: [
              analysis.totalMorosos,
              analysis.totalDeudaCorriente,
              analysis.totalCobrado,
            ],
            backgroundColor: ["#b91c1c", "#2563eb", "#166534"],
            hoverBackgroundColor: ["#b91c1c", "#2563eb", "#166534"],
            borderWidth: 0,
          },
        ],
      };
    }

    return {
      labels: ["Cobranza Judicial", "Morosos", "Deuda Corriente"],
      datasets: [
        {
          data: [
            analysis.totalJudicial,
            analysis.totalMorosos,
            analysis.totalDeudaCorriente,
          ],
          backgroundColor: ["#b91c1c", "#d97706", "#2563eb"],
          hoverBackgroundColor: ["#b91c1c", "#d97706", "#2563eb"],
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

  readonly filteredRows = computed(() => {
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
      case "ANTICIPOS":
        return analysis.anticipos;
      default:
        return [
          ...analysis.cobranzaJudicial,
          ...analysis.morosos,
          ...analysis.deudaCorriente,
          ...analysis.sinAdeudo,
          ...analysis.anticipos,
        ];
    }
  });

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (!customerId) {
        this.data.set(null);
        return;
      }

      void this.loadData(customerId, this.cutoffDateInput());
    });
  }

  async onReload() {
    const customerId = this.customerIdS.customerId();
    if (!customerId) {
      return;
    }

    await this.loadData(customerId, this.cutoffDateInput());
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
    const result =
      await this.apiResponseS.onGetItem<CobranzaOnlineAnalysisResponse>(
        Endpoints.AccountingCoi.CobranzaOnline.Dashboard.analysis(
          customerId,
          year,
          month,
          day,
        ),
        false,
      );
    this.data.set(result ?? null);
    this.loading.set(false);
  }

  navigateTo(route: string) {
    if (route) this.router.navigateByUrl(route);
  }
}
