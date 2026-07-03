import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import { ChartModule } from "primeng/chart";
import { TableModule } from "primeng/table";
import { WebButtonLabel } from "src/app/core/components/buttons/web-label/button";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import {
  IncidentDashboardDTO,
  IncidentDashboardFilterDTO,
} from "../../models/incident.interfaces";

@Component({
  selector: "app-incident-dashboard",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChartModule,
    TableModule,
    CardModule,
    CustomInputDateSignal,
    WebButtonLabel,
  ],
  templateUrl: "./incident-dashboard.html",
})
export class IncidentDashboardComponent implements OnInit {
  private apiResponseS = inject(ApiResponseService);

  loading = signal(false);
  dashboard = signal<IncidentDashboardDTO | null>(null);

  startDateCtrl = new FormControl<string | null>(null);
  endDateCtrl = new FormControl<string | null>(null);

  barChartData = signal<any>(null);
  pieChartData = signal<any>(null);
  barChartOptions = signal<any>(null);
  pieChartOptions = signal<any>(null);

  ngOnInit(): void {
    this.initChartOptions();
    this.loadDashboard();
  }

  private initChartOptions(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary",
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

    this.barChartOptions.set({
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: { color: textColor },
        },
      },
      scales: {
        x: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder },
        },
        y: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder },
        },
      },
    });

    this.pieChartOptions.set({
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: textColor },
        },
      },
    });
  }

  loadDashboard(): void {
    this.loading.set(true);

    const filter: IncidentDashboardFilterDTO = {};
    if (this.startDateCtrl.value) {
      filter.startDate = this.startDateCtrl.value;
    }
    if (this.endDateCtrl.value) {
      filter.endDate = this.endDateCtrl.value;
    }

    const params = new URLSearchParams();
    if (filter.startDate) params.append("startDate", filter.startDate);
    if (filter.endDate) params.append("endDate", filter.endDate);
    const queryString = params.toString();

    this.apiResponseS
      .onGetItem<IncidentDashboardDTO>(
        Endpoints.HR.Incident.dashboard(queryString || undefined),
      )
      .then((result) => {
        if (result) {
          this.dashboard.set(result);
          this.updateCharts(result);
        }
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  private updateCharts(data: IncidentDashboardDTO): void {
    if (data.byMonth.length > 0) {
      this.barChartData.set({
        labels: data.byMonth.map((m) => m.month),
        datasets: [
          {
            label: "Incidencias por Mes",
            data: data.byMonth.map((m) => m.count),
            backgroundColor: "rgba(59, 130, 246, 0.8)",
            borderRadius: 8,
          },
        ],
      });
    }

    if (data.byType.length > 0) {
      this.pieChartData.set({
        labels: data.byType.map((t) => t.name),
        datasets: [
          {
            data: data.byType.map((t) => t.count),
            backgroundColor: [
              "#3B82F6",
              "#10B981",
              "#F59E0B",
              "#EF4444",
              "#8B5CF6",
              "#EC4899",
            ],
            hoverBackgroundColor: [
              "#2563EB",
              "#059669",
              "#D97706",
              "#DC2626",
              "#7C3AED",
              "#DB2777",
            ],
          },
        ],
      });
    }
  }

  onFilter(): void {
    this.loadDashboard();
  }

  onClearFilters(): void {
    this.startDateCtrl.reset();
    this.endDateCtrl.reset();
    this.loadDashboard();
  }
}
