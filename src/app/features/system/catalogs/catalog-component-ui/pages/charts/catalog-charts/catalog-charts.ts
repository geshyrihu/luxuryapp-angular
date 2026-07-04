import { CommonModule } from "@angular/common";
import { Component, computed, input, ViewEncapsulation } from "@angular/core";
import { CardModule } from "primeng/card";
import { ChartWrapper } from "@ui/web/charts/chart-wrapper";
import { CustomBarChart } from "@ui/web/charts/custom-bar-chart";
import { MultiAxisChart } from "@ui/web/charts/multi-axis-chart";
import { PieChart } from "@ui/web/charts/pie-chart";
import { AdvancedPieChart } from "@ui/web/charts/advanced-pie-chart";
import { PrimengRadarChart } from "@ui/web/charts/primeng-radar-chart";

/**
 * Catálogo de gráficos — ejemplos renderizados de los 6 componentes de charts
 * migrados a ECharts (ngx-echarts). Ruta: /settings/ui-catalog/charts.
 */
@Component({
  selector: "app-catalog-charts",
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ChartWrapper,
    CustomBarChart,
    MultiAxisChart,
    PieChart,
    AdvancedPieChart,
    PrimengRadarChart,
  ],
  templateUrl: "./catalog-charts.html",
  styleUrls: ["./catalog-charts.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CatalogCharts {
  isDarkMode = input<boolean>(false);

  // Chart.js format { labels, datasets } — para bar/line/doughnut/radar/wrapper
  barChartData = computed(() => ({
    labels: ["Ene", "Feb", "Mar", "Abr", "May"],
    datasets: [
      {
        label: "Consumo Eléctrico",
        data: [65, 59, 80, 81, 56],
        backgroundColor: "var(--ds-primary)",
        borderColor: "var(--ds-primary)",
        tension: 0.4,
      },
    ],
  }));

  lineChartData = computed(() => ({
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio"],
    datasets: [
      { label: "Gastos", data: [65, 59, 80, 81, 56, 55, 40], borderColor: "#003d9b" },
      { label: "Ingresos", data: [28, 48, 40, 19, 86, 27, 90], borderColor: "#006477" },
    ],
  }));

  doughnutChartData = computed(() => ({
    labels: ["Mantenimiento", "Operaciones", "Administración"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#003d9b", "#006477", "#c9a74d"],
      },
    ],
  }));

  radarChartData = computed(() => ({
    labels: [
      "Comida",
      "Transporte",
      "Vivienda",
      "Servicios",
      "Entretenimiento",
      "Salud",
      "Ahorro",
    ],
    datasets: [
      {
        label: "Presupuesto Asignado",
        borderColor: "#003d9b",
        data: [65, 59, 90, 81, 56, 55, 40],
      },
    ],
  }));

  // Doble eje Y: Ingresos ($, izq) vs Tickets (cant, der)
  multiAxisData = computed(() => ({
    labels: ["Ene", "Feb", "Mar", "Abr", "May"],
    datasets: [
      { label: "Ingresos ($)", data: [12000, 15000, 9000, 18000, 14000], backgroundColor: "#003d9b" },
      { label: "Tickets", data: [40, 55, 30, 70, 50], yAxisID: "y1", backgroundColor: "#c9a74d" },
    ],
  }));

  // ngx-charts format [{ name, value }] — para pie/advanced-pie
  pieChartData = computed(() => [
    { name: "Completado", value: 300 },
    { name: "En Proceso", value: 50 },
    { name: "Pendiente", value: 100 },
  ]);

  pieScheme = { domain: ["#006837", "#c9a74d", "#ba1a1a"] };
}
