import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from "@angular/core";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

export type StockStatus = "critical" | "low" | "medium" | "high" | "overstock";

/**
 * AppInventoryLevel — Indicador visual de nivel de inventario con zonas de color.
 * Uso: ERP almacén, gestión de materiales, punto de reorden.
 */
@Component({
  selector: "app-inventory-level",

  imports: [AppIcon],
  template: `
    <div class="inv-root">
      <div class="inv-header">
        @if (icon()) {
          <app-icon [icon]="icon()" class="inv-product-icon" />
        }
        <div class="inv-info">
          <span class="inv-name">{{ name() }}</span>
          @if (sku()) {
            <span class="inv-sku">{{ sku() }}</span>
          }
        </div>
        <div class="inv-badge" [class]="'inv-badge-' + status()">
          <app-icon [icon]="statusIcon()" class="text-xs" />
          {{ statusLabel() }}
        </div>
      </div>

      <!-- Bar -->
      <div class="inv-bar-wrap">
        <div class="inv-bar-bg">
          <!-- Zone markers -->
          @for (zone of zones; track zone.pct) {
            <div
              class="inv-zone-marker"
              [style.left.%]="zone.pct"
              [title]="zone.label"
            ></div>
          }
          <!-- Fill -->
          <div
            class="inv-bar-fill"
            [style.width.%]="clampedPct()"
            [class]="'inv-fill-' + status()"
          ></div>
        </div>
        <div class="inv-bar-labels">
          <span>0</span>
          <span>{{ max() }}</span>
        </div>
      </div>

      <!-- Metrics row -->
      <div class="inv-metrics">
        <div class="inv-metric">
          <span class="inv-metric-value">{{ current() }}</span>
          <span class="inv-metric-label">Actual</span>
        </div>
        @if (reorderPoint() !== undefined) {
          <div class="inv-metric">
            <span class="inv-metric-value">{{ reorderPoint() }}</span>
            <span class="inv-metric-label">Punto reorden</span>
          </div>
        }
        @if (maxCapacity() !== undefined) {
          <div class="inv-metric">
            <span class="inv-metric-value">{{ maxCapacity() }}</span>
            <span class="inv-metric-label">Capacidad max</span>
          </div>
        }
        <div class="inv-metric">
          <span class="inv-metric-value">{{ clampedPct().toFixed(0) }}%</span>
          <span class="inv-metric-label">Ocupación</span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .inv-root {
        display: flex;
        flex-direction: column;
        gap: 0.625rem;
        padding: 0.75rem;
        background: var(--ds-bg-surface);
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-md);
      }
      .inv-header {
        display: flex;
        align-items: center;
        gap: 0.625rem;
      }
      .inv-product-icon {
        font-size: 1.25rem;
        color: var(--ds-text-secondary);
        flex-shrink: 0;
      }
      .inv-info {
        flex: 1;
        min-width: 0;
      }
      .inv-name {
        display: block;
        font-size: var(--ds-font-size-label);
        font-weight: 600;
        color: var(--ds-text-primary);
      }
      .inv-sku {
        font-size: var(--ds-font-size-micro);
        color: var(--ds-text-muted);
      }
      /* Badge */
      .inv-badge {
        display: flex;
        align-items: center;
        gap: 0.2rem;
        padding: 0.15rem 0.5rem;
        border-radius: var(--ds-radius-full);
        font-size: var(--ds-font-size-micro);
        font-weight: 600;
      }
      .inv-badge-critical {
        background: var(--ds-danger-light);
        color: var(--ds-accent-text-danger);
      }
      .inv-badge-low {
        background: var(--ds-warning-light);
        color: var(--ds-accent-text-warning);
      }
      .inv-badge-medium {
        background: var(--ds-info-light);
        color: var(--ds-accent-text-info);
      }
      .inv-badge-high {
        background: var(--ds-success-light);
        color: var(--ds-accent-text-success);
      }
      .inv-badge-overstock {
        background: var(--ds-bg-muted);
        color: var(--ds-text-muted);
      }
      /* Bar */
      .inv-bar-wrap {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
      }
      .inv-bar-bg {
        position: relative;
        height: 14px;
        background: var(--ds-bg-elevated);
        border-radius: var(--ds-radius-full);
        overflow: visible;
      }
      .inv-zone-marker {
        position: absolute;
        top: -3px;
        bottom: -3px;
        width: 2px;
        background: var(--ds-bg-surface);
        opacity: 0.8;
        border-radius: 1px;
        z-index: 1;
      }
      .inv-bar-fill {
        height: 100%;
        border-radius: var(--ds-radius-full);
        transition: width 0.4s ease;
      }
      .inv-fill-critical {
        background: var(--ds-danger);
      }
      .inv-fill-low {
        background: var(--ds-warning);
      }
      .inv-fill-medium {
        background: var(--ds-primary);
      }
      .inv-fill-high {
        background: var(--ds-success);
      }
      .inv-fill-overstock {
        background: var(--ds-text-muted);
      }
      .inv-bar-labels {
        display: flex;
        justify-content: space-between;
        font-size: 0.65rem;
        color: var(--ds-text-muted);
      }
      /* Metrics */
      .inv-metrics {
        display: flex;
        gap: 0;
      }
      .inv-metric {
        flex: 1;
        text-align: center;
        padding: 0.25rem;
        border-right: 1px solid var(--ds-border);
      }
      .inv-metric:last-child {
        border-right: none;
      }
      .inv-metric-value {
        display: block;
        font-size: var(--ds-font-size-label);
        font-weight: 700;
        color: var(--ds-text-primary);
      }
      .inv-metric-label {
        font-size: 0.65rem;
        color: var(--ds-text-muted);
        text-transform: uppercase;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppInventoryLevel {
  name = input.required<string>();
  current = input.required<number>();
  max = input.required<number>();
  sku = input<string>("");
  icon = input<string>("mdi:package-variant-closed");
  reorderPoint = input<number | undefined>(undefined);
  maxCapacity = input<number | undefined>(undefined);

  readonly zones = [
    { pct: 15, label: "Crítico" },
    { pct: 30, label: "Bajo" },
    { pct: 70, label: "Óptimo" },
    { pct: 90, label: "Máximo" },
  ];

  clampedPct = computed(() =>
    Math.min(100, Math.max(0, (this.current() / this.max()) * 100)),
  );

  status = computed<StockStatus>(() => {
    const p = this.clampedPct();
    if (p >= 90) return "overstock";
    if (p >= 50) return "high";
    if (p >= 30) return "medium";
    if (p >= 15) return "low";
    return "critical";
  });

  statusLabel(): string {
    const map: Record<StockStatus, string> = {
      critical: "Crítico",
      low: "Bajo",
      medium: "Normal",
      high: "Óptimo",
      overstock: "Exceso",
    };
    return map[this.status()];
  }

  statusIcon(): string {
    const map: Record<StockStatus, string> = {
      critical: "mdi:alert-circle",
      low: "mdi:alert",
      medium: "mdi:check-circle",
      high: "mdi:check-circle",
      overstock: "mdi:information",
    };
    return map[this.status()];
  }
}
