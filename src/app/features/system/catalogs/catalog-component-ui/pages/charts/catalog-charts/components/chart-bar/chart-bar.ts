import { Component, input } from "@angular/core";
import { CustomBarChart } from "src/app/core/components/web/charts/custom-bar-chart";

@Component({
  selector: "app-chart-bar",
  standalone: true,
  imports: [CustomBarChart],
  template: `
    <app-custom-bar-chart [data]="data()"></app-custom-bar-chart>
  `,
})
export class ChartBar {
  data = input<any>(null);
}
