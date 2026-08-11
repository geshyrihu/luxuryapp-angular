import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import type { ECharts, EChartsCoreOption } from "echarts/core";
import { NgxEchartsDirective } from "ngx-echarts";
import { ChartJsData, chartJsToRadarOption, resolveDsColor, trackChartTheme } from "./echarts-adapters";

/**
 * PrimengRadarChart — radar / araña. Motor: ECharts (ngx-echarts).
 * API sin cambios: `chartData` en formato Chart.js `{ labels, datasets }`.
 * Mantiene `getBase64Image()` y `reinit()` para el flujo de impresión.
 */
@Component({
  selector: "app-primeng-radar-chart",

  imports: [NgxEchartsDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if ((chartData().datasets?.[0]?.data?.length ?? 0) > 0) {
      <div
        echarts
        [options]="option()"
        (chartInit)="onInit($event)"
        style="height: 340px; display: block"
      ></div>
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

  // Se conserva por compatibilidad de API (ECharts ignora opciones de Chart.js).
  chartOptions = input<unknown>({});

  private instance: ECharts | null = null;

  option = computed<EChartsCoreOption>(() =>
    chartJsToRadarOption(this.chartData()),
  );

  onInit(chart: ECharts): void {
    this.instance = chart;
  }

  /** Imagen base64 del gráfico (para impresión/exportación). */
  public getBase64Image(): string | undefined {
    return this.instance?.getDataURL({
      type: "png",
      pixelRatio: 2,
      backgroundColor: resolveDsColor("--ds-bg-surface"),
    });
  }

  /** Redibuja el gráfico (útil al cambiar el tamaño del contenedor). */
  public reinit(): void {
    this.instance?.resize();
  }
}
