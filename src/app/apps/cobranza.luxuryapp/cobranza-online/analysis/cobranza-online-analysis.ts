import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { ChartWrapper } from "@ui/web/charts/chart-wrapper";
import { ButtonModule } from "@ui/web/primeng-button/primeng-button";

import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { TableModule } from "@ui/web/primeng-table/primeng-table";

import { LxMessage } from "@ui/adaptive/message/message";
import { LxTag } from "@ui/adaptive/tag/tag";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import type { CobranzaOnlineAnalysisResponse } from "../interfaces/cobranza-online-analysis.model";

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
    CustomInputSelectSignal,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    MobileListItem,
    WebButtonLabel,
    ChartWrapper,
    LxTag,
    AppIcon,
    LxMessage,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./cobranza-online-analysis.html",
})
export class CobranzaOnlineAnalysis {
  private router = inject(Router);
  private customerIdS = inject(CustomerIdService);
  private apiResponseS = inject(ApiResponseService);

  readonly loading = signal(false);
  // Filtro independiente: usa fecha de corte específica (con day picker),
  // no comparte cobranzaOnlineFilterState (ver state/cobranza-online-filter.state.ts)
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

  private token(key: string, fallback: string): string {
    if (typeof document === "undefined") {
      return fallback;
    }
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue(key)
        .trim() || fallback
    );
  }

  readonly chartData = computed(() => {
    const analysis = this.data();
    if (!analysis) {
      return null;
    }

    const danger = this.token("--ds-danger", "red");
    const info = this.token("--ds-info", "blue");
    const success = this.token("--ds-success", "green");
    const warning = this.token("--ds-warning", "orange");

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
            backgroundColor: [danger, info, success],
            hoverBackgroundColor: [danger, info, success],
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
          backgroundColor: [danger, warning, info],
          hoverBackgroundColor: [danger, warning, info],
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
        Endpoints.CobranzaOnline.Dashboard.analysis(
          customerId,
          year,
          month,
          day,
        ),
      );
    this.data.set(result ?? null);
    this.loading.set(false);
  }

  navigateTo(route: string) {
    if (route) this.router.navigateByUrl(route);
  }
}
