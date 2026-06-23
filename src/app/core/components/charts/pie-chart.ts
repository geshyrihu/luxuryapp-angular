import { Component, input } from "@angular/core";
import { PieChartModule } from "@swimlane/ngx-charts";

/**
 * 🍩 PIE CHART
 * -------------------------------------------------------------------------
 * Gráfico de pastel clásico (o dona).
 * Simple, legible y delicioso para tus datos.
 */
@Component({
  selector: "app-pie-chart",
  imports: [PieChartModule],
  template: `
    <ngx-charts-pie-chart
      [view]="view()"
      [scheme]="colorScheme()"
      [results]="dataGrafico()"
      [gradient]="gradient"
      [legend]="showLegend"
      [legendPosition]="legendPosition"
      [labels]="true"
      [doughnut]="isDoughnut"
    >
    </ngx-charts-pie-chart>
  `,
})
export class PieChart {
  // <--- Inputs --->
  dataGrafico = input<any[]>([
    {
      name: "Germany",
      value: 8940000,
    },
    {
      name: "USA",
      value: 5000000,
    },
  ]);

  colorScheme = input<any>({
    domain: ["#5AA454", "#A10A28"],
  });

  view = input<[number, number] | undefined>(undefined);

  // <--- Configuración --->
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: any = "below";
}
