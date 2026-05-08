import { Component, input } from "@angular/core";
import { PieChartModule } from "@swimlane/ngx-charts";

/**
 * 🥧 ADVANCED PIE CHART
 * -------------------------------------------------------------------------
 * Gráfico de pastel avanzado usando ngx-charts.
 * Porque a veces un pastel normal no es suficiente. 🍰✨
 */
@Component({
  selector: "app-advanced-pie-chart",
  imports: [PieChartModule],
  template: `
    <ngx-charts-advanced-pie-chart
      [view]="view"
      [scheme]="colorScheme()"
      [results]="dataGrafico()"
      [gradient]="gradient"
    >
    </ngx-charts-advanced-pie-chart>
  `,
})
export class AdvancedPieChart {
  // <--- Inputs --->
  dataGrafico = input<any[]>([]);
  colorScheme = input<any>({
    domain: ["#5AA454", "#A10A28", "#C7B42C"],
  });

  // <--- Configuración Fija --->
  view: [number, number] = [700, 400];
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
}
