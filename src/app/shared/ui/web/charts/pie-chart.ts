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
 * PieChart — pastel / dona. Motor: Chart.js (ng2-charts).
 * API sin cambios: `dataGrafico` en formato ngx-charts `[{ name, value }]`.
 */
@Component({
  selector: "app-pie-chart",

  imports: [BaseChartDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<canvas baseChart type="pie" [data]="chartData()" [options]="option()" [style.height]="chartHeight()"></canvas>`,
})
export class PieChart {
  constructor() {
    trackChartTheme();
  }

  dataGrafico = input<NgxChartsDatum[]>([
    { name: "Germany", value: 8940000 },
    { name: "USA", value: 5000000 },
  ]);

  colorScheme = input<{ domain?: string[] }>({
    domain: ["--ds-cat-7", "--ds-cat-4"],
  });

  view = input<[number, number] | undefined>(undefined);

  isDoughnut = false;

  protected chartHeight = computed(() => {
    const v = this.view();
    return v ? `${v[1]}px` : "300px";
  });

  option = computed<ChartOptions<any>>(() =>
    ngxToPieOption(this.dataGrafico(), this.colorScheme(), {
      doughnut: this.isDoughnut,
    }),
  );

  chartData = computed(() => ngxToPieData(this.dataGrafico(), this.colorScheme()));
}
