import { Component, computed, input, ViewEncapsulation, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxEchartsDirective } from "ngx-echarts";
import type { EChartsCoreOption } from "echarts/core";
import {
  chartJsToCartesianOption,
  chartJsToPieOption,
  chartJsToRadarOption,
  ChartJsData,
} from "./echarts-adapters";

export type ChartType = "bar" | "line" | "area" | "pie" | "doughnut" | "radar" | "polarArea";

/**
 * ChartWrapper — envoltorio genérico de gráficos. Motor: ECharts (ngx-echarts).
 * API sin cambios: `data` en formato Chart.js `{ labels, datasets }`.
 */
@Component({
  selector: "app-chart-wrapper",
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective],
  template: `
    <div class="chart-wrapper-root">
      @if (title()) {
        <strong class="chart-wrapper-title">{{ title() }}</strong>
      }
      <div
        echarts
        [options]="option()"
        [style.height]="height()"
        [style.width]="width()"
      ></div>
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
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class ChartWrapper {
  type = input<ChartType>("bar");
  data = input.required<ChartJsData>();
  options = input<EChartsCoreOption | null>(null);
  title = input<string>("");
  height = input<string>("300px");
  width = input<string>("100%");
  showLegend = input<boolean>(true);
  showGrid = input<boolean>(true);

  option = computed<EChartsCoreOption>(() => {
    if (this.options()) return this.options() as EChartsCoreOption;
    const t = this.type();
    const legendGrid = { showLegend: this.showLegend(), showGrid: this.showGrid() };

    if (t === "pie" || t === "polarArea") {
      return chartJsToPieOption(this.data(), { showLegend: this.showLegend() });
    }
    if (t === "doughnut") {
      return chartJsToPieOption(this.data(), { doughnut: true, showLegend: this.showLegend() });
    }
    if (t === "radar") {
      return chartJsToRadarOption(this.data(), { showLegend: this.showLegend() });
    }
    return chartJsToCartesianOption(this.data(), t as "bar" | "line" | "area", legendGrid);
  });
}
