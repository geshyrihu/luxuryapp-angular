import { Component, computed, input } from "@angular/core";
import { ChartModule } from "primeng/chart";

/**
 * 📊 CUSTOM BAR CHART
 * -------------------------------------------------------------------------
 * Gráfico de barras (o líneas) personalizado con PrimeNG.
 * Ideal para mostrar tendencias y comparaciones. 📈
 */
@Component({
  selector: "app-custom-bar-chart",
  imports: [ChartModule],
  template: `
    <div class="p-card">
      <p-chart
        class="chart"
        [type]="chartType()"
        [data]="dataSignal()"
        [options]="chartOptions()"
      ></p-chart>
    </div>
    <hr />
  `,
})
export class CustomBarChart {
  dataSignal   = input<ChartLinePrime | null>(null, { alias: "data" });
  optionsSignal = input<any>(null, { alias: "options" });
  chartType    = input<'bar' | 'line' | 'doughnut' | 'pie'>('line');

  chartOptions = computed(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary",
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

    const defaultOptions = {
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
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };

    return this.optionsSignal() || defaultOptions;
  });
}

// Interfaces auxiliares
interface Dataset {
  label: string;
  data: number[];
  fill: boolean;
  borderColor: string;
  tension: number;
}

interface ChartLinePrime {
  labels: string[];
  datasets: Dataset[];
}
