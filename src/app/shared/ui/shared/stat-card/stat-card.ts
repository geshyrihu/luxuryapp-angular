import {
  Component,
  computed,
  input,
  ViewEncapsulation,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

/**
 * AppStatCard — KPI card con sparkline SVG inline.
 * Extiende KpiCard añadiendo una minigráfica de tendencia histórica.
 * Uso: dashboards ejecutivos, métricas de ventas, KPIs con histórico.
 */
@Component({
  selector: "app-stat-card",
  standalone: true,
  imports: [CommonModule, AppIcon],
  template: `
    <div class="stat-card">
      <!-- Top row: icon + trend badge -->
      <div class="stat-top">
        @if (icon()) {
          <div class="stat-icon-wrap" [style.background]="iconBg()">
            <app-icon [icon]="icon()" [style.color]="iconColor()" class="stat-icon" />
          </div>
        }
        @if (trend() !== undefined) {
          <span class="stat-trend" [class.stat-trend-up]="trend()! >= 0" [class.stat-trend-down]="trend()! < 0">
            <app-icon [icon]="trend()! >= 0 ? 'mdi:trending-up' : 'mdi:trending-down'" class="text-xs" />
            {{ absTrend() }}%
          </span>
        }
      </div>

      <!-- Value + Label -->
      <div class="stat-value">{{ prefix() }}{{ formattedValue() }}{{ suffix() }}</div>
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
                <stop offset="0%" [attr.stop-color]="sparklineColor()" stop-opacity="0.25" />
                <stop offset="100%" [attr.stop-color]="sparklineColor()" stop-opacity="0" />
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
  styles: [`
    .stat-card {
      background: var(--ds-bg-surface, #fff);
      border: 1px solid var(--ds-border, #e2e8f0);
      border-radius: var(--ds-radius-lg, 8px);
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .stat-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.25rem;
    }
    .stat-icon-wrap {
      width: 36px;
      height: 36px;
      border-radius: var(--ds-radius-md, 6px);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .stat-icon { font-size: 1.125rem; }
    .stat-trend {
      display: flex;
      align-items: center;
      gap: 0.15rem;
      font-size: var(--ds-font-size-micro, 0.75rem);
      font-weight: 600;
      border-radius: var(--ds-radius-full, 9999px);
      padding: 0.15rem 0.5rem;
    }
    .stat-trend-up   { background: #d1fae5; color: #006837; }
    .stat-trend-down { background: #ffdad6; color: #ba1a1a; }
    .stat-value {
      font-size: var(--ds-font-size-metric, 1.5rem);
      font-weight: 700;
      color: var(--ds-text-primary);
      line-height: 1.2;
    }
    .stat-label {
      font-size: var(--ds-font-size-help, 0.8125rem);
      color: var(--ds-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .stat-sparkline {
      margin-top: 0.5rem;
      overflow: hidden;
    }
    .stat-sparkline svg { display: block; width: 100%; }
    .stat-subtitle {
      font-size: var(--ds-font-size-micro, 0.75rem);
      color: var(--ds-text-muted);
      margin-top: 0.125rem;
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class AppStatCard {
  label    = input.required<string>();
  value    = input.required<number>();
  sparkline = input<number[]>([]);
  icon     = input<string>("");
  iconColor = input<string>("var(--ds-primary)");
  iconBg    = input<string>("var(--ds-primary-100, #dae2ff)");
  prefix   = input<string>("");
  suffix   = input<string>("");
  subtitle = input<string>("");
  trend    = input<number | undefined>(undefined);
  format   = input<"number" | "currency" | "percent">("number");
  decimal  = input<number>(0);

  readonly svgWidth  = 120;
  readonly svgHeight = 36;

  gradId = computed(() => `sg-${this.label().replace(/\s+/g, "-").toLowerCase()}`);

  sparklineColor = computed(() =>
    (this.trend() ?? 0) >= 0 ? "#006837" : "#ba1a1a"
  );

  absTrend = computed(() => Math.abs(this.trend() ?? 0));

  formattedValue = computed(() => {
    const v = this.value();
    const fmt = this.format();
    const dec = this.decimal();
    if (fmt === "currency")
      return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: dec }).format(v);
    if (fmt === "percent")
      return new Intl.NumberFormat("es-MX", { style: "percent", minimumFractionDigits: dec }).format(v / 100);
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
    return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  });

  fillPath = computed(() => {
    const pts = this.points();
    if (pts.length < 2) return "";
    const h = this.svgHeight - 2;
    const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
    const last = pts[pts.length - 1];
    const first = pts[0];
    return `${line} L${last.x.toFixed(1)},${h} L${first.x.toFixed(1)},${h} Z`;
  });
}
