import { Component, input, viewChild } from "@angular/core";
import { ChartConfiguration, ChartData } from "chart.js";
import { ChartModule, UIChart } from "primeng/chart";

/**
 * 📡 PRIMENG RADAR CHART
 * -------------------------------------------------------------------------
 * Gráfico de radar (o araña) usando PrimeNG / Chart.js.
 * Perfecto para comparar habilidades, stats o atributos múltiples.
 */
@Component({
  selector: "app-primeng-radar-chart",
  imports: [ChartModule],
  template: `
    @if (chartData().datasets[0].data.length > 0) {
      <div style="display: block">
        <p-chart
          #chartEl
          type="radar"
          [data]="chartData()"
          [options]="chartOptions()"
        ></p-chart>
      </div>
    }
  `,
  styles: [],
})
export class PrimengRadarChart {
  // <--- Signals --->
  chart = viewChild<UIChart>("chartEl");

  chartData = input<ChartData<"radar">>({
    labels: [],
    datasets: [{ data: [], label: "Cargando..." }],
  });

  chartOptions = input<ChartConfiguration["options"]>({
    responsive: true,
  });

  /**
   * Expone de forma segura la imagen del gráfico en formato base64.
   * @returns La imagen en base64 o undefined si el gráfico no está listo.
   */
  public getBase64Image(): string | undefined {
    return this.chart()?.getBase64Image();
  }

  /**
   * Redibuja el gráfico. Esencial para actualizar el tamaño del canvas
   * en escenarios como la impresión, donde el contenedor cambia de tamaño.
   */
  public reinit(): void {
    if (this.chart()) {
      this.chart()!.reinit();
    }
  }
}
