import { CommonModule } from "@angular/common";
import { Component, computed, inject, signal, ViewEncapsulation } from "@angular/core";
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
      @switch (item()) {
        @case ('bar') { <div class="col-12"><app-chart-bar /></div> }
        @case ('pie') { <div class="col-12"><app-chart-pie /></div> }
        @case ('line') { <div class="col-12"><p-chart type="line" [data]="lineData" [options]="chartOptions" /></div> }
        @case ('doughnut') { <div class="col-12"><p-chart type="doughnut" [data]="doughnutData" [options]="chartOptions" /></div> }
        @case ('radar') { <div class="col-12"><p-chart type="radar" [data]="radarData" [options]="chartOptions" /></div> }
      }
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

  isDark = document.documentElement.classList.contains('theme-dark');
  style = getComputedStyle(document.body);
  primaryColor = this.style.getPropertyValue('--ds-primary').trim() || '#0b3164';
  secondaryColor = this.style.getPropertyValue('--ds-secondary').trim() || '#64748b';
  successColor = this.style.getPropertyValue('--ds-success').trim() || '#065f46';
  warningColor = this.style.getPropertyValue('--ds-warning').trim() || '#c9a84c';
  dangerColor = this.style.getPropertyValue('--ds-error').trim() || '#991b1b';
  tertiaryColor = this.style.getPropertyValue('--ds-tertiary').trim() || '#0f766e';

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
    datasets: [{ label: 'Presupuesto', data: [65, 59, 90, 81, 56, 55, 40], borderColor: this.primaryColor, backgroundColor: this.primaryColor + '33', pointBackgroundColor: this.primaryColor }],
  };

  chartOptions = { plugins: { legend: { labels: { color: 'var(--ds-text-secondary)' } } } };
}
