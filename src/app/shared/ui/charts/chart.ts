import {
  ChangeDetectionStrategy,
  Component,
  input,
} from "@angular/core";
import type { ChartOptions } from "chart.js";
import { ChartWrapper, type ChartType } from "@ui/web/charts/chart-wrapper";
import type { ChartJsData } from "@ui/web/charts/chart-adapters";

/**
 * Public Design System chart component.
 * Chart.js is current engine; Lagos chart families map to these native types.
 */
@Component({
  selector: "app-ds-chart",
  imports: [ChartWrapper],
  template: `
    <app-chart-wrapper
      [type]="type()"
      [data]="data()"
      [options]="options()"
      [optionsFactory]="optionsFactory()"
      [title]="title()"
      [height]="height()"
      [width]="width()"
      [showLegend]="showLegend()"
      [showGrid]="showGrid()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsChart {
  type = input<ChartType>("bar");
  data = input.required<ChartJsData>();
  options = input<ChartOptions<any> | null>(null);
  optionsFactory = input<(() => ChartOptions<any>) | null>(null);
  title = input("");
  height = input("300px");
  width = input("100%");
  showLegend = input(true);
  showGrid = input(true);
}
