import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from "@angular/core";

export interface BreakdownItem {
  /** Etiqueta de la categoría. */
  label: string;
  /** Importe o cantidad de la categoría. */
  value: number;
  /** Color de la barra. Usar tokens: var(--ds-danger), var(--ds-info)… */
  color?: string;
  /** Aclaración corta bajo la etiqueta. */
  description?: string;
  /** Fila de total: sin barra, tipografía reforzada y separador arriba. */
  isTotal?: boolean;
}

/**
 * AppBreakdownList — desglose de un total en categorías, con barra proporcional
 * y porcentaje por fila.
 *
 * Sustituye a las tablas planas de "clasificación / saldo / %" en dashboards:
 * la barra deja ver el peso relativo de cada categoría sin leer los números.
 *
 * El porcentaje se calcula contra `total` si se indica; si no, contra la suma de
 * los items que no son total. Pasar `total` explícito cuando las categorías no
 * cubren el 100% (por ejemplo, si una clasificación queda fuera del reporte).
 *
 * ```html
 * <app-breakdown-list
 *   [items]="filas()"
 *   [total]="cobranzaPerfecta()"
 *   format="currency"
 * />
 * ```
 */
@Component({
  selector: "app-breakdown-list",
  template: `
    @if (showSummaryBar() && segments().length) {
      <div
        class="breakdown-summary"
        role="img"
        [attr.aria-label]="summaryAriaLabel()"
      >
        @for (segment of segments(); track segment.label) {
          <span
            class="breakdown-summary-segment"
            [style.width.%]="segment.percent * 100"
            [style.background]="segment.color"
            [title]="segment.label + ': ' + formatPercent(segment.percent)"
          ></span>
        }
      </div>
    }

    <ul class="breakdown-list">
      @for (row of rows(); track row.label) {
        <li class="breakdown-row" [class.breakdown-row-total]="row.isTotal">
          <div class="breakdown-head">
            <span class="breakdown-label">
              @if (!row.isTotal) {
                <span
                  class="breakdown-dot"
                  [style.background]="row.color"
                ></span>
              }
              {{ row.label }}
            </span>
            <span class="breakdown-value">{{ formatValue(row.value) }}</span>
          </div>

          @if (!row.isTotal) {
            <div class="breakdown-track">
              <span
                class="breakdown-fill"
                [style.width.%]="row.percent * 100"
                [style.background]="row.color"
              ></span>
            </div>
          }

          <div class="breakdown-meta">
            @if (row.description) {
              <span class="breakdown-description">{{ row.description }}</span>
            }
            <span class="breakdown-percent">{{
              formatPercent(row.percent)
            }}</span>
          </div>
        </li>
      }
    </ul>
  `,
  styles: [
    `
      .breakdown-summary {
        display: flex;
        width: 100%;
        height: 8px;
        border-radius: var(--ds-radius-full, 9999px);
        overflow: hidden;
        background: var(--ds-surface-container, #eef1f5);
        margin-bottom: var(--ds-space-lg, 1rem);
      }
      .breakdown-summary-segment {
        display: block;
        height: 100%;
        transition: width 0.3s ease;
      }

      .breakdown-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: var(--ds-space-md, 0.75rem);
      }
      .breakdown-row {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .breakdown-row-total {
        border-top: 1px solid var(--ds-border, #d7dbe3);
        padding-top: var(--ds-space-md, 0.75rem);
        margin-top: 0.25rem;
      }

      .breakdown-head {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: var(--ds-space-md, 0.75rem);
      }
      .breakdown-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: var(--ds-font-size-table, 0.875rem);
        color: var(--ds-text-primary);
        min-width: 0;
      }
      .breakdown-row-total .breakdown-label,
      .breakdown-row-total .breakdown-value {
        font-weight: 700;
      }
      .breakdown-dot {
        width: 8px;
        height: 8px;
        border-radius: var(--ds-radius-full, 9999px);
        flex-shrink: 0;
      }
      .breakdown-value {
        font-variant-numeric: tabular-nums;
        font-weight: 600;
        color: var(--ds-text-primary);
        white-space: nowrap;
      }

      .breakdown-track {
        height: 6px;
        border-radius: var(--ds-radius-full, 9999px);
        background: var(--ds-surface-container, #eef1f5);
        overflow: hidden;
      }
      .breakdown-fill {
        display: block;
        height: 100%;
        border-radius: inherit;
        transition: width 0.3s ease;
      }

      .breakdown-meta {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: var(--ds-space-md, 0.75rem);
        font-size: var(--ds-font-size-micro, 0.75rem);
        color: var(--ds-text-muted);
      }
      .breakdown-description {
        min-width: 0;
        line-height: 1.4;
      }
      .breakdown-percent {
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
        margin-left: auto;
      }

      @media (prefers-reduced-motion: reduce) {
        .breakdown-fill,
        .breakdown-summary-segment {
          transition: none;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppBreakdownList {
  readonly items = input.required<BreakdownItem[]>();
  /** Base del porcentaje. Si se omite, la suma de los items que no son total. */
  readonly total = input<number | undefined>(undefined);
  readonly format = input<"number" | "currency">("currency");
  readonly decimals = input<number>(0);
  /** Barra apilada de resumen sobre la lista. */
  readonly showSummaryBar = input<boolean>(true);

  private readonly base = computed(() => {
    const explicito = this.total();
    if (explicito !== undefined && explicito !== 0) return Math.abs(explicito);

    const suma = this.items()
      .filter((item) => !item.isTotal)
      .reduce((acumulado, item) => acumulado + Math.abs(item.value), 0);

    return suma || 1;
  });

  readonly rows = computed(() =>
    this.items().map((item) => ({
      ...item,
      color: item.color ?? "var(--ds-primary)",
      percent: Math.abs(item.value) / this.base(),
    })),
  );

  readonly segments = computed(() =>
    this.rows().filter((row) => !row.isTotal && row.percent > 0),
  );

  readonly summaryAriaLabel = computed(() =>
    this.segments()
      .map((s) => `${s.label} ${this.formatPercent(s.percent)}`)
      .join(", "),
  );

  formatValue(value: number): string {
    if (this.format() === "currency") {
      return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: this.decimals(),
        maximumFractionDigits: this.decimals(),
      }).format(value);
    }

    return new Intl.NumberFormat("es-MX", {
      minimumFractionDigits: this.decimals(),
      maximumFractionDigits: this.decimals(),
    }).format(value);
  }

  formatPercent(percent: number): string {
    return new Intl.NumberFormat("es-MX", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(percent);
  }
}
