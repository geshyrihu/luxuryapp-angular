import { Component, input, computed, ViewEncapsulation, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChartWrapper } from "@ui/web/charts/chart-wrapper";

@Component({
  selector: "app-funnel-chart",
  standalone: true,
  imports: [CommonModule, ChartWrapper],
  template: `
    <div class="funnel-root">
      @if (title()) {
        <strong class="funnel-title">{{ title() }}</strong>
      }
      <app-chart-wrapper
        type="bar"
        [data]="chartData()"
        [options]="chartOptions()"
        height="300px"
        width="100%"
        [showLegend]="false"
        [showGrid]="false"
      />
    </div>
  `,
  styles: [`
    .funnel-root {
      background: var(--ds-bg-surface, #ffffff);
      border: 1px solid var(--ds-border, #e2e8f0);
      border-radius: var(--ds-radius-lg, 8px);
      padding: 1rem;
    }
    .funnel-title {
      display: block;
      font-size: var(--ds-font-size-card-title, 1rem);
      color: var(--ds-text-primary);
      margin-bottom: 0.75rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class FunnelChart {
  labels = input.required<string[]>();
  values = input.required<number[]>();
  title = input<string>("");
  colors = input<string[]>([
    "rgba(0,61,155,0.85)", "rgba(0,61,155,0.7)",
    "rgba(0,61,155,0.55)", "rgba(0,61,155,0.4)",
    "rgba(0,61,155,0.25)",
  ]);

  chartData = computed(() => ({
    labels: this.labels(),
    datasets: [{
      data: this.values(),
      backgroundColor: this.colors().slice(0, this.labels().length),
      borderRadius: 4,
    }],
  }));

  chartOptions = computed(() => ({
    indexAxis: "y" as const,
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.parsed.x} (${this.percentOfTotal(ctx.parsed.x)})`,
        },
      },
    },
    scales: {
      x: { display: false, grid: { display: false } },
      y: {
        grid: { display: false },
        ticks: {
          font: { size: 12 },
          color: "var(--ds-text-primary)",
        },
      },
    },
  }));

  private total = computed(() => this.values().reduce((a, b) => a + b, 0));

  percentOfTotal(value: number): string {
    const t = this.total();
    if (!t) return "0%";
    return Math.round((value / t) * 100) + "%";
  }
}
