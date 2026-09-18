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
 * CustomBarChart — barras / líneas. Motor: Chart.js (ng2-charts).
 * API sin cambios: `data` en formato Chart.js `{ labels, datasets }`.
 */
@Component({
  selector: "app-custom-bar-chart",

  imports: [BaseChartDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="p-card">
      <canvas baseChart [type]="chartType() === 'line' ? 'line' : 'bar'" [data]="chartData()" [options]="option()" style="height: 320px"></canvas>
    </div>
    <hr />
  `,
})
export class CustomBarChart {
  constructor() {
    trackChartTheme();
  }

  dataSignal = input<ChartJsData | null>(null, { alias: "data" });
  optionsSignal = input<ChartOptions<any> | null>(null, { alias: "options" });
  chartType = input<"bar" | "line" | "doughnut" | "pie">("line");

  option = computed<ChartOptions<any>>(() => {
    dsThemeTick(); // dependencia de tema en TODAS las ramas (RN-DS-015)
    if (this.optionsSignal()) return this.optionsSignal() as ChartOptions<any>;
    const type = this.chartType() === "line" ? "line" : "bar";
    return chartJsToCartesianOption(this.dataSignal(), type);
  });

  chartData = computed(() => chartJsToCartesianData(
    this.dataSignal(),
    this.chartType() === "line" ? "line" : "bar",
  ));
}
