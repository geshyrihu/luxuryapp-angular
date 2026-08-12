import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from "@angular/core";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import type { AppIconName } from "src/app/shared/ui/shared/app-icon/app-icon.catalog";

/**
 * AppStatCard — KPI card con sparkline SVG inline.
 * Extiende KpiCard añadiendo una minigráfica de tendencia histórica.
 * Uso: dashboards ejecutivos, métricas de ventas, KPIs con histórico.
 */
@Component({
  selector: "app-stat-card",

  imports: [AppIcon],
  template: `
    <div
      class="stat-card"
      [class.stat-card-horizontal]="orientation() === 'horizontal'"
    >
      @if (icon()) {
        <div class="stat-icon-wrap" [style.background]="iconBg()">
          <app-icon
            [icon]="icon()"
            [style.color]="iconColor()"
            class="stat-icon"
          />
        </div>
      }
      @if (trend() !== undefined) {
        <span
          class="stat-trend"
          [class.stat-trend-up]="trend()! >= 0"
          [class.stat-trend-down]="trend()! < 0"
        >
          <app-icon
            [icon]="trend()! >= 0 ? 'material-symbols-light:trending-up' : 'material-symbols-light:trending-down'"
            class="text-xs"
          />
          {{ absTrend() }}%
        </span>
      }

      <!-- Value + Label -->
      <div class="stat-value">
        {{ prefix() }}{{ formattedValue() }}{{ suffix() }}
      </div>
      <div class="stat-label">{{ label() }}</div>

      <!-- Sparkline SVG -->
      @if (sparkline().length > 1) {
        <div class="stat-sparkline">
          <svg
            [attr.viewBox]="'0 0 ' + svgWidth + ' ' + svgHeight"
            [attr.width]="svgWidth"
            [attr.height]="svgHeight"
            preserveAspectRatio="none"
          >
            <!-- Gradient fill under line -->
            <defs>
              <linearGradient [id]="gradId()" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  [attr.stop-color]="sparklineColor()"
                  stop-opacity="0.25"
                />
                <stop
                  offset="100%"
                  [attr.stop-color]="sparklineColor()"
                  stop-opacity="0"
                />
              </linearGradient>
            </defs>
            <path
              [attr.d]="fillPath()"
              [attr.fill]="'url(#' + gradId() + ')'"
            />
            <path
              [attr.d]="linePath()"
              fill="none"
              [attr.stroke]="sparklineColor()"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      }

      @if (subtitle()) {
        <span class="stat-subtitle">{{ subtitle() }}</span>
      }
    </div>
  `,
  styles: [
    `
      /* Vertical (default): icono y tendencia arriba, luego valor, label y pie.
         Horizontal: icono a la izquierda, ocupando el alto del contenido. */
      .stat-card {
        background: var(--ds-bg-surface);
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-lg);
        padding: 1rem;
        display: grid;
        grid-template-columns: auto 1fr;
        grid-template-areas:
          "icon trend"
          "value value"
          "label label"
          "spark spark"
          "sub sub";
        align-content: start;
        row-gap: 0.25rem;
        column-gap: 0.75rem;
      }
      .stat-card-horizontal {
        grid-template-columns: auto minmax(0, 1fr) auto;
        grid-template-areas:
          "icon value trend"
          "icon label label"
          "icon spark spark"
          "icon sub sub";
        align-items: center;
        align-content: center;
      }
      .stat-card-horizontal .stat-icon-wrap {
        grid-row: 1 / -1;
        align-self: center;
      }

      .stat-card > .stat-icon-wrap {
        grid-area: icon;
      }
      .stat-card > .stat-trend {
        grid-area: trend;
        justify-self: end;
        align-self: center;
      }
      .stat-card > .stat-value {
        grid-area: value;
      }
      .stat-card > .stat-label {
        grid-area: label;
      }
      .stat-card > .stat-sparkline {
        grid-area: spark;
      }
      .stat-card > .stat-subtitle {
        grid-area: sub;
      }
      .stat-icon-wrap {
        width: 36px;
        height: 36px;
        border-radius: var(--ds-radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .stat-icon {
        font-size: 1.125rem;
      }
      .stat-trend {
        display: flex;
        align-items: center;
        gap: 0.15rem;
        font-size: var(--ds-font-size-micro);
        font-weight: 600;
        border-radius: var(--ds-radius-full);
        padding: 0.15rem 0.5rem;
        white-space: nowrap;
      }
      .stat-trend-up {
        background: var(--ds-success-light);
        color: var(--ds-accent-text-success);
      }
      .stat-trend-down {
        background: var(--ds-danger-light);
        color: var(--ds-accent-text-danger);
      }
      .stat-value {
        font-size: var(--ds-font-size-metric);
        font-weight: 700;
        color: var(--ds-text-primary);
        line-height: 1.2;
      }
      .stat-label {
        font-size: var(--ds-font-size-help);
        color: var(--ds-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .stat-sparkline {
        margin-top: 0.5rem;
        overflow: hidden;
      }
      .stat-sparkline svg {
        display: block;
        width: 100%;
      }
      .stat-subtitle {
        font-size: var(--ds-font-size-micro);
        color: var(--ds-text-muted);
        margin-top: 0.125rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppStatCard {
  label = input.required<string>();
  value = input.required<number>();
  /**
   * `vertical` (default): icono arriba, datos debajo.
   * `horizontal`: icono a la izquierda alineado con los datos — ocupa menos alto,
   * útil en filas de KPIs sobre dashboards densos.
   */
  orientation = input<"vertical" | "horizontal">("vertical");
  sparkline = input<number[]>([]);
  icon = input<AppIconName>();
  iconColor = input<string>("var(--ds-primary)");
  iconBg = input<string>("var(--primary-100)");
  prefix = input<string>("");
  suffix = input<string>("");
  subtitle = input<string>("");
  trend = input<number | undefined>(undefined);
  format = input<"number" | "currency" | "percent">("number");
  decimal = input<number>(0);

  readonly svgWidth = 120;
  readonly svgHeight = 36;

  gradId = computed(
    () => `sg-${this.label().replace(/\s+/g, "-").toLowerCase()}`,
  );

  sparklineColor = computed(() =>
    (this.trend() ?? 0) >= 0 ? "var(--ds-accent-text-success)" : "var(--ds-accent-text-danger)",
  );

  absTrend = computed(() => Math.abs(this.trend() ?? 0));

  formattedValue = computed(() => {
    const v = this.value();
    const fmt = this.format();
    const dec = this.decimal();
    if (fmt === "currency")
      return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: dec,
      }).format(v);
    if (fmt === "percent")
      return new Intl.NumberFormat("es-MX", {
        style: "percent",
        minimumFractionDigits: dec,
      }).format(v / 100);
    return new Intl.NumberFormat("es-MX").format(v);
  });

  private points = computed(() => {
    const data = this.sparkline();
    if (data.length < 2) return [];
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const w = this.svgWidth;
    const h = this.svgHeight;
    const pad = 2;
    return data.map((v, i) => ({
      x: (i / (data.length - 1)) * (w - pad * 2) + pad,
      y: h - pad - ((v - min) / range) * (h - pad * 2),
    }));
  });

  linePath = computed(() => {
    const pts = this.points();
    if (pts.length < 2) return "";
    return pts
      .map(
        (p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`,
      )
      .join(" ");
  });

  fillPath = computed(() => {
    const pts = this.points();
    if (pts.length < 2) return "";
    const h = this.svgHeight - 2;
    const line = pts
      .map(
        (p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`,
      )
      .join(" ");
    const last = pts[pts.length - 1];
    const first = pts[0];
    return `${line} L${last.x.toFixed(1)},${h} L${first.x.toFixed(1)},${h} Z`;
  });
}
