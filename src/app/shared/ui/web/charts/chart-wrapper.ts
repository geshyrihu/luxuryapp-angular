import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from "@angular/core";
import type { EChartsCoreOption } from "echarts/core";
import { NgxEchartsDirective } from "ngx-echarts";
import {
  ChartJsData,
  chartJsToCartesianOption,
  chartJsToPieOption,
  chartJsToRadarOption,
  dsThemeTick,
  trackChartTheme,
} from "./echarts-adapters";

export type ChartType =
  "bar" | "line" | "area" | "pie" | "doughnut" | "radar" | "polarArea";

/**
 * ChartWrapper — envoltorio genérico de gráficos. Motor: ECharts (ngx-echarts).
 * API sin cambios: `data` en formato Chart.js `{ labels, datasets }`.
 */
@Component({
  selector: "app-chart-wrapper",

  imports: [NgxEchartsDirective],
  template: `
    <div class="chart-wrapper-root">
      @if (title()) {
        <strong class="chart-wrapper-title">{{ title() }}</strong>
      }
      <div
        echarts
        [options]="option()"
        [style.height]="height()"
        [style.width]="width()"
      ></div>
    </div>
  `,
  styles: [
    `
      .chart-wrapper-root {
        background: var(--ds-bg-surface);
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-lg);
        padding: 1rem;
      }
      .chart-wrapper-title {
        display: block;
        font-size: var(--ds-font-size-card-title);
        color: var(--ds-text-primary);
        margin-bottom: 0.75rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class ChartWrapper {
  constructor() {
    trackChartTheme();
  }

  type = input<ChartType>("bar");
  data = input.required<ChartJsData>();
  /**
   * Opciones ECharts ya construidas. ESCAPE HATCH **NO** reactivo al tema:
   * ChartWrapper no puede devolver la reactividad de tema a un valor que ya
   * llegó resuelto (RN-DS-040). Si pasas `[options]` construidas una sola vez,
   * el chart se congela en el tema en que se pintó por primera vez. Para
   * opciones que deban repintar al cambiar el tema, usa `optionsFactory`.
   */
  options = input<EChartsCoreOption | null>(null);

  /**
   * Fábrica de options que se RE-INVOCA en cada cambio de tema (RN-DS-040).
   * Debe producir las options llamando a los resolutores de tokens
   * (`resolveDsColor`/`cssVar`) en su cuerpo, de modo que el `computed` de
   * ChartWrapper re-ejecute la fábrica al cambiar el tema y repinta. Es la vía
   * reactiva; preferirla sobre `options` cuando el color dependa de tokens.
   */
  optionsFactory = input<(() => EChartsCoreOption) | null>(null);
  title = input<string>("");
  height = input<string>("300px");
  width = input<string>("100%");
  showLegend = input<boolean>(true);
  showGrid = input<boolean>(true);

  option = computed<EChartsCoreOption>(() => {
    dsThemeTick(); // dependencia de tema en TODAS las ramas (RN-DS-015)
    const f = this.optionsFactory();
    if (f) return f(); // se re-invoca al cambiar el tema
    if (this.options()) return this.options() as EChartsCoreOption;
    const t = this.type();
    const legendGrid = {
      showLegend: this.showLegend(),
      showGrid: this.showGrid(),
    };

    if (t === "pie" || t === "polarArea") {
      return chartJsToPieOption(this.data(), { showLegend: this.showLegend() });
    }
    if (t === "doughnut") {
      return chartJsToPieOption(this.data(), {
        doughnut: true,
        showLegend: this.showLegend(),
      });
    }
    if (t === "radar") {
      return chartJsToRadarOption(this.data(), {
        showLegend: this.showLegend(),
      });
    }
    return chartJsToCartesianOption(
      this.data(),
      t as "bar" | "line" | "area",
      legendGrid,
    );
  });
}
