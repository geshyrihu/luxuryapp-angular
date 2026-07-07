import { Component, input, ChangeDetectionStrategy } from "@angular/core";
import { CustomBarChart } from "@ui/web/charts/custom-bar-chart";

@Component({
  selector: "app-chart-bar",
  standalone: true,
  imports: [CustomBarChart],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-custom-bar-chart [data]="data()"></app-custom-bar-chart>
  `,
})
export class ChartBar {
  data = input<any>(null);
}
