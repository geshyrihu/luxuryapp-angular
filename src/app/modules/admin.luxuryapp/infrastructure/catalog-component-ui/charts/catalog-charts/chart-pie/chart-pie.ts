import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { PieChart } from "@ui/web/charts/pie-chart";

@Component({
  selector: "app-chart-pie",

  imports: [PieChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <lux-pie-chart-web [dataGrafico]="data()"></lux-pie-chart-web> `,
})
export class ChartPie {
  data = input<any[]>([]);
}
