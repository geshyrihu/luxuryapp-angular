import { Component, input } from "@angular/core";
import { PieChart } from "src/app/core/components/charts/pie-chart";

@Component({
  selector: "app-chart-pie",
  standalone: true,
  imports: [PieChart],
  template: `
    <app-pie-chart [dataGrafico]="data()"></app-pie-chart>
  `,
})
export class ChartPie {
  data = input<any[]>([]);
}
