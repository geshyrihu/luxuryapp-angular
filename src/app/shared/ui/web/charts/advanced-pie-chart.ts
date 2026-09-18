import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import type { ChartOptions } from "chart.js";
import { BaseChartDirective } from "ng2-charts";
import { NgxChartsDatum, ngxToPieData, ngxToPieOption, trackChartTheme } from "./chart-adapters";

/**
 * AdvancedPieChart — pastel con leyenda/detalle. Motor: Chart.js (ng2-charts).
 * API sin cambios: `dataGrafico` en formato ngx-charts `[{ name, value }]`.
 */
@Component({
  selector: "app-advanced-pie-chart",

  imports: [BaseChartDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<canvas baseChart type="pie" [data]="chartData()" [options]="option()" style="height: 400px"></canvas>`,
})
export class AdvancedPieChart {
  constructor() {
    trackChartTheme();
  }

  dataGrafico = input<NgxChartsDatum[]>([]);
  colorScheme = input<{ domain?: string[] }>({
    domain: ["--ds-cat-7", "--ds-cat-4", "--ds-cat-5"],
  });

  option = computed<ChartOptions<any>>(() =>
    ngxToPieOption(this.dataGrafico(), this.colorScheme(), {
      showLegend: true,
    }),
  );

  chartData = computed(() => ngxToPieData(this.dataGrafico(), this.colorScheme()));
}
