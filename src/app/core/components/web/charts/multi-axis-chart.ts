import { Component, computed, input } from "@angular/core";
import { ChartModule } from "primeng/chart";

/**
 * 🎢 MULTI AXIS CHART
 * -------------------------------------------------------------------------
 * Gráfico multitarea: Dos ejes Y para comparar peras con manzanas.
 * (O ingresos vs cantidad). 🍎🍐
 */
@Component({
  selector: "app-multi-axis-chart",
  imports: [ChartModule],
  template: `
    <div class="p-card">
      <p-chart
        type="bar"
        [data]="dataSignal()"
        [options]="chartOptions()"
      ></p-chart>
    </div>
  `,
})
export class MultiAxisChart {
  dataSignal = input<any>(null, { alias: "data" });
  optionsSignal = input<any>(null, { alias: "options" });

  chartOptions = computed(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary",
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

    const defaultOptions = {
      stacked: false,
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          type: "linear",
          display: true,
          position: "left",
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            drawOnChartArea: false,
            color: surfaceBorder,
          },
        },
      },
    };

    return this.optionsSignal() || defaultOptions;
  });
}
