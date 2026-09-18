import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewChild,
} from "@angular/core";
import type { Chart, ChartOptions } from "chart.js";
import { BaseChartDirective } from "ng2-charts";
import { ChartJsData, chartJsToRadarData, chartJsToRadarOption, trackChartTheme } from "./chart-adapters";

/**
 * PrimengRadarChart — radar / araña. Motor: Chart.js (ng2-charts).
 * API sin cambios: `chartData` en formato Chart.js `{ labels, datasets }`.
 * Mantiene `getBase64Image()` y `reinit()` para el flujo de impresión.
 */
@Component({
  selector: "app-primeng-radar-chart",

  imports: [BaseChartDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if ((chartData().datasets?.[0]?.data?.length ?? 0) > 0) {
      <canvas
        baseChart
        #chart="base-chart"
        type="radar"
        [data]="renderData()"
        [options]="option()"
        (chartClick)="onInit(chart.chart)"
        style="height: 340px; display: block"
      ></canvas>
    }
  `,
})
export class PrimengRadarChart {
  constructor() {
    trackChartTheme();
  }

  chartData = input<ChartJsData>({
    labels: [],
    datasets: [{ data: [], label: "Cargando..." }],
  });

  // Se conserva por compatibilidad de API.
  chartOptions = input<unknown>({});

  @ViewChild(BaseChartDirective) private chartDirective?: BaseChartDirective;

  option = computed<ChartOptions<"radar">>(() =>
    chartJsToRadarOption(this.chartData()),
  );

  renderData = computed(() => chartJsToRadarData(this.chartData()));

  onInit(chart?: Chart): void {
    void chart;
  }

  /** Imagen base64 del gráfico (para impresión/exportación). */
  public getBase64Image(): string | undefined {
    const canvas = this.chartDirective?.chart?.canvas;
    if (!canvas) return undefined;
    return canvas.toDataURL("image/png");
  }

  /** Redibuja el gráfico (útil al cambiar el tamaño del contenedor). */
  public reinit(): void {
    this.chartDirective?.chart?.resize();
  }
}
