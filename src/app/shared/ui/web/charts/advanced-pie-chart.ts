import { Component, computed, input, ChangeDetectionStrategy } from "@angular/core";
import { NgxEchartsDirective } from "ngx-echarts";
import type { EChartsCoreOption } from "echarts/core";
import { ngxToPieOption, NgxChartsDatum } from "./echarts-adapters";

/**
 * AdvancedPieChart — pastel con leyenda/detalle. Motor: ECharts (ngx-echarts).
 * API sin cambios: `dataGrafico` en formato ngx-charts `[{ name, value }]`.
 */
@Component({
  selector: "app-advanced-pie-chart",
  standalone: true,
  imports: [NgxEchartsDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<div echarts [options]="option()" style="height: 400px"></div>`,
})
export class AdvancedPieChart {
  dataGrafico = input<NgxChartsDatum[]>([]);
  colorScheme = input<{ domain?: string[] }>({
    domain: ["#5AA454", "#A10A28", "#C7B42C"],
  });

  option = computed<EChartsCoreOption>(() =>
    ngxToPieOption(this.dataGrafico(), this.colorScheme(), { showLegend: true }),
  );
}
