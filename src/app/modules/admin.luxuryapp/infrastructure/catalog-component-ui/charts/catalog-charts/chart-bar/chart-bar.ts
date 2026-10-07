import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { LuxBarChart } from "@ui/web/charts/lux-bar-chart";

@Component({
  selector: "app-chart-bar",

  imports: [LuxBarChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <lux-bar-chart-web [data]="data()"></lux-bar-chart-web> `,
})
export class ChartBar {
  data = input<any>(null);
}
