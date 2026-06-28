import { Component, computed, input, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";

@Component({
  selector: "app-kpi-card",
  standalone: true,
  imports: [CommonModule, AppIcon],
  template: `
    <div
      class="kpi-card"
      [class.kpi-card-clickable]="clickable()"
      (click)="onClick()"
    >
      <div class="kpi-header">
        @if (icon()) {
          <app-icon [icon]="icon()" class="kpi-icon" [style.color]="iconColor()" />
        }
        <span class="kpi-label">{{ label() }}</span>
      </div>

      <div class="kpi-value-row">
        <strong class="kpi-value">{{ prefix() }}{{ formattedValue() }}{{ suffix() }}</strong>
      </div>

      @if (trend() || subtitle()) {
        <div class="kpi-footer">
          @if (trend()) {
            <div class="kpi-trend" [class.kpi-trend-up]="trend()! > 0" [class.kpi-trend-down]="trend()! < 0">
              <app-icon
                [icon]="trend()! >= 0 ? 'mdi:trending-up' : 'mdi:trending-down'"
                class="text-sm"
              />
              <span>{{ absTrend() }}%</span>
            </div>
          }
          @if (subtitle()) {
            <span class="kpi-subtitle">{{ subtitle() }}</span>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .kpi-card {
      background: var(--ds-bg-surface, #ffffff);
      border: 1px solid var(--ds-border, #e2e8f0);
      border-radius: var(--ds-radius-lg, 8px);
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      transition: box-shadow 0.15s;
    }
    .kpi-card-clickable {
      cursor: pointer;
    }
    .kpi-card-clickable:hover {
      box-shadow: var(--ds-shadow-sm);
    }
    .kpi-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .kpi-icon {
      font-size: 1.25rem;
    }
    .kpi-label {
      font-size: var(--ds-font-size-help, 0.8125rem);
      color: var(--ds-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .kpi-value-row {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }
    .kpi-value {
      font-size: var(--ds-font-size-metric, 1.5rem);
      color: var(--ds-text-primary);
      line-height: 1.2;
    }
    .kpi-footer {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 0.25rem;
    }
    .kpi-trend {
      display: flex;
      align-items: center;
      gap: 0.2rem;
      font-size: var(--ds-font-size-table, 0.875rem);
      font-weight: 500;
    }
    .kpi-trend-up {
      color: var(--ds-success, #006837);
    }
    .kpi-trend-down {
      color: var(--ds-danger, #ba1a1a);
    }
    .kpi-subtitle {
      font-size: var(--ds-font-size-help, 0.8125rem);
      color: var(--ds-text-muted);
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class KpiCard {
  label = input.required<string>();
  value = input.required<number>();
  icon = input<string>("");
  iconColor = input<string>("var(--ds-primary)");
  prefix = input<string>("");
  suffix = input<string>("");
  subtitle = input<string>("");
  trend = input<number | undefined>(undefined);
  format = input<"number" | "currency" | "percent">("number");
  decimal = input<number>(0);
  clickable = input<boolean>(false);

  formattedValue = computed(() => {
    const v = this.value();
    const fmt = this.format();
    const dec = this.decimal();

    if (fmt === "currency") {
      return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: dec,
      }).format(v);
    }
    if (fmt === "percent") {
      return new Intl.NumberFormat("es-MX", {
        style: "percent",
        minimumFractionDigits: dec,
      }).format(v / 100);
    }
    return new Intl.NumberFormat("es-MX").format(v);
  });

  absTrend = computed(() => Math.abs(this.trend() || 0));

  onClick(): void {
    return;
  }
}
