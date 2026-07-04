import { Component, computed, input } from "@angular/core";
import { NgxEchartsDirective } from "ngx-echarts";
import type { EChartsCoreOption } from "echarts/core";
import { ngxToPieOption, NgxChartsDatum } from "./echarts-adapters";

/**
 * PieChart — pastel / dona. Motor: ECharts (ngx-echarts).
 * API sin cambios: `dataGrafico` en formato ngx-charts `[{ name, value }]`.
 */
@Component({
  selector: "app-pie-chart",
  standalone: true,
  imports: [NgxEchartsDirective],
  template: `<div echarts [options]="option()" [style.height]="chartHeight()"></div>`,
})
export class PieChart {
  dataGrafico = input<NgxChartsDatum[]>([
    { name: "Germany", value: 8940000 },
    { name: "USA", value: 5000000 },
  ]);

  colorScheme = input<{ domain?: string[] }>({ domain: ["#5AA454", "#A10A28"] });

  view = input<[number, number] | undefined>(undefined);

  isDoughnut = false;

  protected chartHeight = computed(() => {
    const v = this.view();
    return v ? `${v[1]}px` : "300px";
  });

  option = computed<EChartsCoreOption>(() =>
    ngxToPieOption(this.dataGrafico(), this.colorScheme(), {
      doughnut: this.isDoughnut,
    }),
  );
}
