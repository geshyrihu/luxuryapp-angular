import { Injectable } from "@angular/core";
import { Chart, ChartConfiguration, ChartData } from "chart.js";
@Injectable({
  providedIn: "root",
})
export class ChartGeneratorService {
  /**
   * Generates a base64 image representation of a radar chart "headlessly"
   * (without rendering it to the DOM).
   * @param data The Chart.js data object.
   * @param options The Chart.js configuration options.
   * @returns A promise that resolves to the base64 string of the chart image.
   */
  public generateRadarChartBase64(
    data: ChartData<"radar">,
    options?: ChartConfiguration["options"],
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      // Merge default options with provided options
      const finalOptions: ChartConfiguration["options"] = {
        ...options,
        // CRITICAL: Disable animations for instant rendering
        animation: false,
        // Ensure the chart is not responsive to a non-existent container
        responsive: false,
      };

      // Create a canvas element in memory
      const canvas = document.createElement("canvas");
      canvas.width = 1000; // Increase resolution for better quality in PDF
      canvas.height = 500;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return reject(new Error("Failed to get canvas context"));
      }

      const chart = new Chart(ctx, {
        type: "radar",
        data: data,
        options: finalOptions,
      });

      // The chart rendering is asynchronous, even with animations off.
      // A small timeout ensures the chart is fully drawn before we capture it.
      setTimeout(() => {
        try {
          const base64Image = chart.toBase64Image();
          chart.destroy(); // Clean up the chart instance
          resolve(base64Image);
        } catch (error) {
          reject(error);
        }
      }, 100); // 100ms delay as a safeguard
    });
  }
}









