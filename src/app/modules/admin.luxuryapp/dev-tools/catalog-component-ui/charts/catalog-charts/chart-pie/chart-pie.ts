import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { PieChart } from "@ui/web/charts/pie-chart";

@Component({
  selector: "app-chart-pie",

  imports: [PieChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <app-pie-chart [dataGrafico]="data()"></app-pie-chart> `,
})
export class ChartPie {
  data = input<any[]>([]);
}
