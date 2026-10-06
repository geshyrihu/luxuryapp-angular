import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { CustomBarChart } from "@ui/web/charts/custom-bar-chart";

@Component({
  selector: "app-chart-bar",

  imports: [CustomBarChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <lux-custom-bar-chart-web [data]="data()"></lux-custom-bar-chart-web> `,
})
export class ChartBar {
  data = input<any>(null);
}
