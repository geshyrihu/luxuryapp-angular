import { CommonModule } from "@angular/common";
import { Component, computed, input, ViewEncapsulation } from "@angular/core";
import { CardModule } from "primeng/card";
import { ChartBar } from "./components/chart-bar/chart-bar";
import { ChartPie } from "./components/chart-pie/chart-pie";
import { ChartModule } from "primeng/chart";

@Component({
  selector: "app-catalog-charts",
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ChartBar,
    ChartPie,
    ChartModule,
  ],
  templateUrl: "./catalog-charts.html",
  styleUrls: ["./catalog-charts.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CatalogCharts {
  isDarkMode = input<boolean>(false);

  barChartData = computed(() => {
    const isDark = this.isDarkMode();
    const style = getComputedStyle(document.body);
    const primaryColor = style.getPropertyValue('--ds-primary').trim() || (isDark ? "#3b82f6" : "#0b3164");
    return {
      labels: ["Ene", "Feb", "Mar", "Abr", "May"],
      datasets: [
        {
          label: "Consumo Eléctrico",
          data: [65, 59, 80, 81, 56],
          backgroundColor: primaryColor,
          fill: false,
          borderColor: primaryColor,
          tension: 0.4,
        },
      ],
    };
  });

  pieChartData = computed<any[]>(() => {
    const isDark = this.isDarkMode();
    const style = getComputedStyle(document.body);
    const successColor = style.getPropertyValue('--ds-success').trim() || (isDark ? "#10b981" : "#065f46");
    const warningColor = style.getPropertyValue('--ds-warning').trim() || (isDark ? "#f59e0b" : "#c9a84c");
    const dangerColor = style.getPropertyValue('--ds-error').trim() || (isDark ? "#ef4444" : "#991b1b");
    return [
      { name: "Completado", value: 300, color: successColor },
      { name: "En Proceso", value: 50, color: warningColor },
      { name: "Pendiente", value: 100, color: dangerColor },
    ];
  });

  lineChartData = computed(() => {
    const isDark = this.isDarkMode();
    const style = getComputedStyle(document.body);
    const primaryColor = style.getPropertyValue('--ds-primary').trim() || (isDark ? "#3b82f6" : "#0b3164");
    const secondaryColor = style.getPropertyValue('--ds-secondary').trim() || (isDark ? "#94a3b8" : "#64748b");
    
    return {
      labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio"],
      datasets: [
        {
          label: "Gastos",
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: primaryColor,
          tension: 0.4
        },
        {
          label: "Ingresos",
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderColor: secondaryColor,
          tension: 0.4
        }
      ]
    };
  });

  doughnutChartData = computed(() => {
    const isDark = this.isDarkMode();
    const style = getComputedStyle(document.body);
    const color1 = style.getPropertyValue('--ds-primary').trim() || (isDark ? "#3b82f6" : "#0b3164");
    const color2 = style.getPropertyValue('--ds-tertiary').trim() || (isDark ? "#14b8a6" : "#0f766e");
    const color3 = style.getPropertyValue('--ds-luxury-gold').trim() || (isDark ? "#d8bd69" : "#c9a84c");

    return {
      labels: ['Mantenimiento', 'Operaciones', 'Administración'],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: [color1, color2, color3],
          hoverBackgroundColor: [color1, color2, color3]
        }
      ]
    };
  });

  radarChartData = computed(() => {
    const isDark = this.isDarkMode();
    const style = getComputedStyle(document.body);
    const primaryLight = style.getPropertyValue('--ds-primary-light').trim() || (isDark ? "rgba(59, 130, 246, 0.2)" : "rgba(11, 49, 100, 0.2)");
    const primaryColor = style.getPropertyValue('--ds-primary').trim() || (isDark ? "#3b82f6" : "#0b3164");

    return {
      labels: ['Comida', 'Transporte', 'Vivienda', 'Servicios', 'Entretenimiento', 'Salud', 'Ahorro'],
      datasets: [
        {
          label: 'Presupuesto Asignado',
          backgroundColor: primaryLight,
          borderColor: primaryColor,
          pointBackgroundColor: primaryColor,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: primaryColor,
          data: [65, 59, 90, 81, 56, 55, 40]
        }
      ]
    };
  });

  chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: 'var(--ds-text-secondary)'
        }
      }
    },
    scales: {
      x: {
        ticks: { color: 'var(--ds-text-secondary)' },
        grid: { color: 'var(--ds-border)' }
      },
      y: {
        ticks: { color: 'var(--ds-text-secondary)' },
        grid: { color: 'var(--ds-border)' }
      }
    }
  };

  circularOptions = {
    plugins: {
      legend: {
        labels: {
          color: 'var(--ds-text-secondary)'
        }
      }
    }
  };
}
