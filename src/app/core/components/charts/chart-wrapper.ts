import { Component, computed, input, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChartModule } from "primeng/chart";

export type ChartType = "bar" | "line" | "area" | "pie" | "doughnut" | "radar" | "polarArea";

@Component({
  selector: "app-chart-wrapper",
  standalone: true,
  imports: [CommonModule, ChartModule],
  template: `
    <div class="chart-wrapper-root">
      @if (title()) {
        <strong class="chart-wrapper-title">{{ title() }}</strong>
      }
      <p-chart
        [type]="chartType()"
        [data]="data()"
        [options]="mergedOptions()"
        [height]="height()"
        [width]="width()"
      />
    </div>
  `,
  styles: [`
    .chart-wrapper-root {
      background: var(--ds-bg-surface, #ffffff);
      border: 1px solid var(--ds-border, #e2e8f0);
      border-radius: var(--ds-radius-lg, 8px);
      padding: 1rem;
    }
    .chart-wrapper-title {
      display: block;
      font-size: var(--ds-font-size-card-title, 1rem);
      color: var(--ds-text-primary);
      margin-bottom: 0.75rem;
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class ChartWrapper {
  type = input<ChartType>("bar");
  data = input.required<any>();
  options = input<any>(null);
  title = input<string>("");
  height = input<string>("300px");
  width = input<string>("100%");
  showLegend = input<boolean>(true);
  showGrid = input<boolean>(true);

  chartType = computed(() => {
    const t = this.type();
    if (t === "area") return "line";
    return t;
  });

  mergedOptions = computed(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--ds-text-secondary") || "#434654";
    const textMuted = documentStyle.getPropertyValue("--ds-text-muted") || "#737685";
    const borderColor = documentStyle.getPropertyValue("--ds-border") || "#e2e8f0";
    const isArea = this.type() === "area";

    const defaults: any = {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          display: this.showLegend(),
          labels: {
            color: textColor,
            boxWidth: 12,
            padding: 16,
            font: { size: 12 },
          },
        },
      },
      scales: {},
    };

    if (this.chartType() !== "pie" && this.chartType() !== "doughnut" && this.chartType() !== "polarArea") {
      defaults.scales = {
        x: {
          display: true,
          grid: { display: this.showGrid(), color: borderColor },
          ticks: { color: textMuted, font: { size: 11 } },
        },
        y: {
          display: true,
          beginAtZero: true,
          grid: { display: this.showGrid(), color: borderColor },
          ticks: { color: textMuted, font: { size: 11 } },
        },
      };
    }

    if (this.chartType() === "radar") {
      defaults.scales = {
        r: {
          grid: { color: borderColor },
          ticks: { display: false },
          pointLabels: { color: textColor, font: { size: 11 } },
        },
      };
    }

    if (isArea && this.data()?.datasets) {
      defaults.elements = {
        line: {
          tension: 0.4,
          fill: true,
          backgroundColor: this.data()?.datasets?.[0]?.backgroundColor || "rgba(0, 61, 155, 0.15)",
        },
      };
    }

    return { ...defaults, ...(this.options() || {}) };
  });
}
