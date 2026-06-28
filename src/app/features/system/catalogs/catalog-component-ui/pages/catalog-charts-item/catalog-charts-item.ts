import { CommonModule } from "@angular/common";
import { Component, inject, signal, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CardModule } from "primeng/card";
import { ChartModule } from "primeng/chart";
import { ChartBar } from "../catalog-charts/components/chart-bar/chart-bar";
import { ChartPie } from "../catalog-charts/components/chart-pie/chart-pie";

const CHARTS_LABELS: Record<string, string> = {
  bar: "Bar Chart",
  pie: "Pie Chart",
  line: "Line Chart",
  doughnut: "Doughnut Chart",
  radar: "Radar Chart",
};

@Component({
  selector: "app-catalog-charts-item",
  imports: [CommonModule, CardModule, ChartModule, ChartBar, ChartPie],
  template: `
    <section class="fadein">
      <div class="section-header mb-4">
        <h2 class="text-3xl font-bold m-0">{{ label }}</h2>
      </div>
      <p-card>
        @switch (item()) {
          @case ('bar') { <app-chart-bar [data]="barData" /> }
          @case ('pie') { <app-chart-pie [data]="pieData" /> }
          @case ('line') { <p-chart type="line" [data]="lineData" [options]="chartOptions" height="300px" /> }
          @case ('doughnut') { <p-chart type="doughnut" [data]="doughnutData" [options]="circularOptions" height="300px" /> }
          @case ('radar') { <p-chart type="radar" [data]="radarData" [options]="circularOptions" height="300px" /> }
        }
      </p-card>
    </section>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class CatalogChartsItem {
  private route = inject(ActivatedRoute);
  item = signal('');
  get label(): string { return CHARTS_LABELS[this.item()] ?? this.item(); }

  constructor() {
    this.route.paramMap.subscribe(p => this.item.set(p.get('item') ?? ''));
  }

  private getStyle = (key: string, fallback: string) =>
    getComputedStyle(document.body).getPropertyValue(key).trim() || fallback;

  primaryColor = this.getStyle('--ds-primary', '#00050e');
  secondaryColor = this.getStyle('--ds-secondary', '#64748b');
  tertiaryColor = this.getStyle('--ds-tertiary', '#0f766e');
  warningColor = this.getStyle('--ds-warning', '#c9a74d');

  barData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
    datasets: [
      { label: 'Consumo Eléctrico', data: [65, 59, 80, 81, 56], fill: false, borderColor: this.primaryColor, tension: 0.4 },
    ],
  };

  pieData = [
    { name: 'Completado', value: 300 },
    { name: 'En Proceso', value: 50 },
    { name: 'Pendiente', value: 100 },
  ];

  lineData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      { label: 'Serie A', data: [65, 59, 80, 81, 56, 55], fill: false, borderColor: this.primaryColor, tension: 0.4 },
      { label: 'Serie B', data: [28, 48, 40, 19, 86, 27], fill: false, borderColor: this.secondaryColor, tension: 0.4 },
    ],
  };

  doughnutData = {
    labels: ['Mantenimiento', 'Operaciones', 'Administración'],
    datasets: [{ data: [300, 50, 100], backgroundColor: [this.primaryColor, this.tertiaryColor, this.warningColor] }],
  };

  radarData = {
    labels: ['Comida', 'Transporte', 'Vivienda', 'Servicios', 'Entretenimiento', 'Salud', 'Ahorro'],
    datasets: [{
      label: 'Presupuesto',
      data: [65, 59, 90, 81, 56, 55, 40],
      borderColor: this.primaryColor,
      backgroundColor: this.primaryColor + '33',
      pointBackgroundColor: this.primaryColor,
    }],
  };

  private textColor = this.getStyle('--ds-text-secondary', '#64748b');

  chartOptions = {
    plugins: { legend: { labels: { color: this.textColor } } },
    scales: {
      x: { ticks: { color: this.textColor }, grid: { color: 'var(--ds-border)' } },
      y: { ticks: { color: this.textColor }, grid: { color: 'var(--ds-border)' } },
    },
  };

  circularOptions = {
    plugins: { legend: { labels: { color: this.textColor } } },
  };
}
