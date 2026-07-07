import { Component, input, ChangeDetectionStrategy } from "@angular/core";
import { PieChart } from "@ui/web/charts/pie-chart";

@Component({
  selector: "app-chart-pie",
  standalone: true,
  imports: [PieChart],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-pie-chart [dataGrafico]="data()"></app-pie-chart>
  `,
})
export class ChartPie {
  data = input<any[]>([]);
}
