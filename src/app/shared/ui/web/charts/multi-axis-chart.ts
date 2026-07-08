import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import type { EChartsCoreOption } from "echarts/core";
import { NgxEchartsDirective } from "ngx-echarts";
import { ChartJsData, chartJsToCartesianOption } from "./echarts-adapters";

/**
 * MultiAxisChart — barras con doble eje Y. Motor: ECharts (ngx-echarts).
 * API sin cambios: `data` en formato Chart.js `{ labels, datasets }`
 * (usa `yAxisID: "y1"` en un dataset para el eje derecho).
 */
@Component({
  selector: "app-multi-axis-chart",

  imports: [NgxEchartsDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="p-card">
      <div echarts [options]="option()" style="height: 320px"></div>
    </div>
  `,
})
export class MultiAxisChart {
  dataSignal = input<ChartJsData | null>(null, { alias: "data" });
  optionsSignal = input<EChartsCoreOption | null>(null, { alias: "options" });

  option = computed<EChartsCoreOption>(() => {
    if (this.optionsSignal()) return this.optionsSignal() as EChartsCoreOption;
    return chartJsToCartesianOption(this.dataSignal(), "bar", {
      dualAxis: true,
    });
  });
}
