import { Component, computed, input } from "@angular/core";
import { NgxEchartsDirective } from "ngx-echarts";
import type { EChartsCoreOption } from "echarts/core";
import { chartJsToCartesianOption, ChartJsData } from "./echarts-adapters";

/**
 * CustomBarChart — barras / líneas. Motor: ECharts (ngx-echarts).
 * API sin cambios: `data` en formato Chart.js `{ labels, datasets }`.
 */
@Component({
  selector: "app-custom-bar-chart",
  standalone: true,
  imports: [NgxEchartsDirective],
  template: `
    <div class="p-card">
      <div echarts [options]="option()" style="height: 320px"></div>
    </div>
    <hr />
  `,
})
export class CustomBarChart {
  dataSignal = input<ChartJsData | null>(null, { alias: "data" });
  optionsSignal = input<EChartsCoreOption | null>(null, { alias: "options" });
  chartType = input<"bar" | "line" | "doughnut" | "pie">("line");

  option = computed<EChartsCoreOption>(() => {
    if (this.optionsSignal()) return this.optionsSignal() as EChartsCoreOption;
    const type = this.chartType() === "line" ? "line" : "bar";
    return chartJsToCartesianOption(this.dataSignal(), type);
  });
}
