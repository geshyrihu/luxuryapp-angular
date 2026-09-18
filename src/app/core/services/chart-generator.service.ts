import { Injectable } from "@angular/core";
import { Chart } from "chart.js/auto";
import {
  chartJsToRadarData,
  chartJsToRadarOption,
  ChartJsData,
} from "@ui/web/charts/chart-adapters";

/** Datos del radar en formato Chart.js `{ labels, datasets }` (compatibilidad). */
export type RadarChartData = ChartJsData;

@Injectable({
  providedIn: "root",
})
export class ChartGeneratorService {
  /**
   * Genera una imagen base64 (PNG) de un gráfico de radar de forma "headless"
    * (sin renderizarlo en el DOM). Motor: Chart.js.
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
        const canvas = document.createElement("canvas");
        canvas.width = 1000;
        canvas.height = 500;
        const chart = new Chart(canvas, {
          type: "radar",
          data: chartJsToRadarData(data),
          options: { ...option, animation: false, responsive: false },
        });

        const base64Image = chart.toBase64Image("image/png", 1);
        chart.destroy();
        resolve(base64Image);
      } catch (error) {
        reject(error);
      }
    });
  }
}
