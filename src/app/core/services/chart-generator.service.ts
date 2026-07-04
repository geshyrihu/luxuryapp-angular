import { Injectable } from "@angular/core";
import * as echarts from "echarts";
import {
  chartJsToRadarOption,
  ChartJsData,
} from "src/app/core/components/web/charts/echarts-adapters";

/** Datos del radar en formato Chart.js `{ labels, datasets }` (compatibilidad). */
export type RadarChartData = ChartJsData;

@Injectable({
  providedIn: "root",
})
export class ChartGeneratorService {
  /**
   * Genera una imagen base64 (PNG) de un gráfico de radar de forma "headless"
   * (sin renderizarlo en el DOM). Motor: ECharts.
   * @param data Datos del radar en formato Chart.js `{ labels, datasets }`.
   * @param opts Opciones; `max` fija el tope de la escala radial (p. ej. 5).
   * @returns Promesa que resuelve al string base64 de la imagen.
   */
  public generateRadarChartBase64(
    data: RadarChartData,
    opts?: { max?: number },
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const option = chartJsToRadarOption(data, {
          showLegend: true,
          max: opts?.max,
        });

        // Contenedor en memoria con dimensiones explícitas (no requiere DOM).
        const div = document.createElement("div");
        const chart = echarts.init(div, null, {
          renderer: "canvas",
          width: 1000,
          height: 500,
        });

        // Animaciones desactivadas → render síncrono antes de capturar.
        chart.setOption(
          { ...(option as object), animation: false, backgroundColor: "#ffffff" },
          true,
        );

        const base64Image = chart.getDataURL({ type: "png", pixelRatio: 2 });
        chart.dispose();
        resolve(base64Image);
      } catch (error) {
        reject(error);
      }
    });
  }
}
