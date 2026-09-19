import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import type { ChartOptions } from "chart.js";
import { BaseChartDirective } from "ng2-charts";
import { ChartJsData, chartJsToCartesianData, chartJsToCartesianOption, dsThemeTick, trackChartTheme } from "./chart-adapters";

/**
 * MultiAxisChart — barras con doble eje Y. Motor: Chart.js (ng2-charts).
 * API sin cambios: `data` en formato Chart.js `{ labels, datasets }`
 * (usa `yAxisID: "y1"` en un dataset para el eje derecho).
 */
@Component({
  selector: "app-multi-axis-chart",

  imports: [BaseChartDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="card">
      <canvas baseChart type="bar" [data]="chartData()" [options]="option()" style="height: 320px"></canvas>
    </div>
  `,
})
export class MultiAxisChart {
  constructor() {
    trackChartTheme();
  }

  dataSignal = input<ChartJsData | null>(null, { alias: "data" });
  optionsSignal = input<ChartOptions<any> | null>(null, { alias: "options" });

  option = computed<ChartOptions<any>>(() => {
    dsThemeTick(); // dependencia de tema en TODAS las ramas (RN-DS-015)
    if (this.optionsSignal()) return this.optionsSignal() as ChartOptions<any>;
    return chartJsToCartesianOption(this.dataSignal(), "bar", {
      dualAxis: true,
    });
  });

  chartData = computed(() => chartJsToCartesianData(this.dataSignal(), "bar", { dualAxis: true }));
}
