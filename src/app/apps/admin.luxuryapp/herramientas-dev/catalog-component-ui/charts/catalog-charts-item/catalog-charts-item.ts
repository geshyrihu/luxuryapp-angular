import {
  Component,
  inject,
  signal,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { ChartWrapper } from "@ui/web/charts/chart-wrapper";
import { ChartBar } from "../catalog-charts/chart-bar/chart-bar";
import { ChartPie } from "../catalog-charts/chart-pie/chart-pie";

const CHARTS_LABELS: Record<string, string> = {
  bar: "Bar Chart",
  pie: "Pie Chart",
  line: "Line Chart",
  doughnut: "Doughnut Chart",
  radar: "Radar Chart",
};

@Component({
  selector: "app-catalog-charts-item",
  imports: [ChartWrapper, ChartBar, ChartPie, AppIcon],
  template: `
    <section class="fadein">
      <div class="section-header mb-4">
        <h2 class="text-3xl font-bold m-0">{{ label }}</h2>
        <p class="text-sm text-secondary mt-1 m-0">
          <span class="badge-web">Web</span> + <span class="badge-mobile">Mobile</span>
        </p>
      </div>
      <div class="unified-split">
        <div class="unified-web">
          <div class="card">
            @switch (item()) {
              @case ("bar") {
                <app-chart-bar [data]="barData" />
              }
              @case ("pie") {
                <app-chart-pie [data]="pieData" />
              }
              @case ("line") {
                <app-chart-wrapper
                  type="line"
                  [data]="lineData"
                  [options]="chartOptions"
                  height="300px"
                />
              }
              @case ("doughnut") {
                <app-chart-wrapper
                  type="doughnut"
                  [data]="doughnutData"
                  [options]="circularOptions"
                  height="300px"
                />
              }
              @case ("radar") {
                <app-chart-wrapper
                  type="radar"
                  [data]="radarData"
                  [options]="circularOptions"
                  height="300px"
                />
              }
            }
          </div>
        </div>
        <div class="unified-mobile">
          <div class="phone-card">
            <div class="phone-dynamic-island"></div>
            <div class="phone-screen">
              <div class="flex flex-column align-items-center justify-content-center h-full text-secondary text-sm p-3 gap-3">
                <app-icon icon="mdi:chart-timeline-variant" class="text-4xl text-gray-400" />
                <span class="text-center font-medium">Gráficos no disponibles en versión mobile</span>
                <span class="text-center text-xs">Los gráficos se renderizan solo en web (ECharts / ngx-charts)</span>
              </div>
            </div>
            <div class="phone-home-bar"></div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .badge-web {
        background: var(--ds-primary);
        color: var(--ds-on-primary);
        padding: 0.1rem 0.4rem;
        border-radius: 4px;
        font-size: 0.65rem;
        font-weight: 600;
      }
      .badge-mobile {
        background: #6366f1;
        color: white;
        padding: 0.1rem 0.4rem;
        border-radius: 4px;
        font-size: 0.65rem;
        font-weight: 600;
      }
      .unified-split {
        display: flex;
        gap: 1.5rem;
        align-items: flex-start;
      }
      .unified-web {
        flex: 3;
        min-width: 0;
      }
      .unified-mobile {
        flex: 1;
        position: sticky;
        top: 5rem;
        align-self: flex-start;
        max-width: 340px;
      }
      .phone-card {
        background: #1a1a2e;
        border-radius: 40px;
        padding: 12px 8px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4),
          inset 0 0 0 1px rgba(255, 255, 255, 0.08);
        position: relative;
      }
      .phone-dynamic-island {
        width: 110px;
        height: 26px;
        background: #0d0d1a;
        border-radius: 20px;
        margin: 0 auto 10px;
      }
      .phone-screen {
        background: var(--ds-bg-page);
        border-radius: 28px;
        overflow-y: auto;
        height: 640px;
        padding: 0.5rem;
      }
      .phone-screen::-webkit-scrollbar {
        width: 3px;
      }
      .phone-screen::-webkit-scrollbar-thumb {
        background: var(--ds-border);
        border-radius: 3px;
      }
      .phone-home-bar {
        width: 120px;
        height: 4px;
        background: rgba(255, 255, 255, 0.25);
        border-radius: 2px;
        margin: 8px auto 2px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CatalogChartsItem {
  private route = inject(ActivatedRoute);
  item = signal("");
  get label(): string {
    return CHARTS_LABELS[this.item()] ?? this.item();
  }

  constructor() {
    this.route.paramMap.subscribe((p) => this.item.set(p.get("item") ?? ""));
  }

  private getStyle = (key: string, fallback: string) =>
    getComputedStyle(document.body).getPropertyValue(key).trim() || fallback;

  primaryColor = this.getStyle("--ds-primary", "#00050e");
  secondaryColor = this.getStyle("--ds-secondary", "#64748b");
  tertiaryColor = this.getStyle("--ds-tertiary", "#0f766e");
  warningColor = this.getStyle("--ds-warning", "#c9a74d");

  barData = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May"],
    datasets: [
      {
        label: "Consumo Elóctrico",
        data: [65, 59, 80, 81, 56],
        fill: false,
        borderColor: this.primaryColor,
        tension: 0.4,
      },
    ],
  };

  pieData = [
    { name: "Completado", value: 300 },
    { name: "En Proceso", value: 50 },
    { name: "Pendiente", value: 100 },
  ];

  lineData = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        label: "Serie A",
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: this.primaryColor,
        tension: 0.4,
      },
      {
        label: "Serie B",
        data: [28, 48, 40, 19, 86, 27],
        fill: false,
        borderColor: this.secondaryColor,
        tension: 0.4,
      },
    ],
  };

  doughnutData = {
    labels: ["Mantenimiento", "Operaciones", "Administración"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: [
          this.primaryColor,
          this.tertiaryColor,
          this.warningColor,
        ],
      },
    ],
  };

  radarData = {
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
        label: "Presupuesto",
        data: [65, 59, 90, 81, 56, 55, 40],
        borderColor: this.primaryColor,
        backgroundColor: this.primaryColor + "33",
        pointBackgroundColor: this.primaryColor,
      },
    ],
  };

  private textColor = this.getStyle("--ds-text-secondary", "#64748b");

  chartOptions = {
    plugins: { legend: { labels: { color: this.textColor } } },
    scales: {
      x: {
        ticks: { color: this.textColor },
        grid: { color: "var(--ds-border)" },
      },
      y: {
        ticks: { color: this.textColor },
        grid: { color: "var(--ds-border)" },
      },
    },
  };

  circularOptions = {
    plugins: { legend: { labels: { color: this.textColor } } },
  };
}
