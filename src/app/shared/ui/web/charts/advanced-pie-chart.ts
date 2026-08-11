import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import type { EChartsCoreOption } from "echarts/core";
import { NgxEchartsDirective } from "ngx-echarts";
import { NgxChartsDatum, ngxToPieOption, trackChartTheme } from "./echarts-adapters";

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
  constructor() {
    trackChartTheme();
  }

  dataGrafico = input<NgxChartsDatum[]>([]);
  colorScheme = input<{ domain?: string[] }>({
    domain: ["--ds-cat-7", "--ds-cat-4", "--ds-cat-5"],
  });

  option = computed<EChartsCoreOption>(() =>
    ngxToPieOption(this.dataGrafico(), this.colorScheme(), {
      showLegend: true,
    }),
  );
}
