import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import type { EChartsCoreOption } from "echarts/core";
import { NgxEchartsDirective } from "ngx-echarts";
import { NgxChartsDatum, ngxToPieOption } from "./echarts-adapters";

/**
 * AdvancedPieChart — pastel con leyenda/detalle. Motor: ECharts (ngx-echarts).
 * API sin cambios: `dataGrafico` en formato ngx-charts `[{ name, value }]`.
 */
@Component({
  selector: "app-advanced-pie-chart",

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
    ngxToPieOption(this.dataGrafico(), this.colorScheme(), {
      showLegend: true,
    }),
  );
}
