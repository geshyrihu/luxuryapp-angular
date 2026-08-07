import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  ViewEncapsulation,
} from "@angular/core";

export interface RankedListItem {
  /** Clave estable para `track`; normalmente el número de cuenta. */
  id: string;
  /** Línea principal. Ej: "A-501 ALEJANDRO GOLDEBERG". */
  title: string;
  /** Línea secundaria opcional. Ej: la cuenta contable. */
  subtitle?: string;
  /** Importe mostrado a la derecha y usado para la barra proporcional. */
  amount: number;
}

/**
 * AppRankedList — listado ordenado por importe, con encabezado de total y barra
 * proporcional por fila.
 *
 * Pensado para rankings donde importa el peso relativo de cada renglón (deudores,
 * saldos a favor, consumo por torre). No confundir con `app-breakdown-list`, que
 * descompone un total en categorías fijas: aquí las filas son entidades y la lista
 * puede ser larga y navegable.
 *
 * Las filas se renderizan como `<button>` cuando hay quien escuche `itemSelected`,
 * para que el teclado pueda recorrerlas; si no, son `<div>` y no reciben foco.
 *
 * ```html
 * <app-ranked-list
 *   heading="Morosos"
 *   [items]="morosos()"
 *   [total]="totalMorosos()"
 *   accent="var(--ds-warning)"
 *   (itemSelected)="verDetalle($event)"
 * />
 * ```
 */
@Component({
  selector: "app-ranked-list",
  imports: [NgTemplateOutlet],
  template: `
    <div class="ranked-list">
      <header class="ranked-list-header">
        <div class="ranked-list-heading-group">
          <span class="ranked-list-heading">{{ heading() }}</span>
          <span class="ranked-list-count">{{ items().length }}</span>
        </div>
        <span class="ranked-list-total" [style.color]="accent()">
          {{ formatAmount(resolvedTotal()) }}
        </span>
      </header>

      @if (items().length) {
        <ul class="ranked-list-items" [style.max-height]="maxHeight()">
          @for (item of items(); track item.id; let index = $index) {
            <li>
              @if (interactive()) {
                <button
                  type="button"
                  class="ranked-list-row ranked-list-row-interactive"
                  (click)="itemSelected.emit(item)"
                >
                  <ng-container
                    *ngTemplateOutlet="
                      rowContent;
                      context: { $implicit: item, index: index }
                    "
                  />
                </button>
              } @else {
                <div class="ranked-list-row">
                  <ng-container
                    *ngTemplateOutlet="
                      rowContent;
                      context: { $implicit: item, index: index }
                    "
                  />
                </div>
              }
            </li>
          }
        </ul>
      } @else {
        <p class="ranked-list-empty">{{ emptyMessage() }}</p>
      }
    </div>

    <ng-template #rowContent let-item let-index="index">
      <span class="ranked-list-rank">{{ index + 1 }}</span>
      <span class="ranked-list-body">
        <span class="ranked-list-title">{{ item.title }}</span>
        @if (item.subtitle) {
          <span class="ranked-list-subtitle">{{ item.subtitle }}</span>
        }
        <span class="ranked-list-bar-track">
          <span
            class="ranked-list-bar"
            [style.width.%]="share(item.amount) * 100"
            [style.background]="accent()"
          ></span>
        </span>
      </span>
      <span class="ranked-list-amount">{{ formatAmount(item.amount) }}</span>
    </ng-template>
  `,
  styles: [
    `
      .ranked-list {
        display: flex;
        flex-direction: column;
        background: var(--ds-surface);
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-lg, 0.75rem);
        overflow: hidden;
      }

      .ranked-list-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--ds-space-sm, 0.5rem);
        padding: var(--ds-space-md, 0.75rem) var(--ds-space-lg, 1rem);
        border-bottom: 1px solid var(--ds-border);
        background: var(--ds-surface-container);
      }

      .ranked-list-heading-group {
        display: flex;
        align-items: center;
        gap: var(--ds-space-sm, 0.5rem);
        min-width: 0;
      }

      .ranked-list-heading {
        font-size: var(--ds-font-size-label, 0.8125rem);
        font-weight: var(--ds-font-weight-bold, 700);
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--ds-text-secondary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .ranked-list-count {
        flex-shrink: 0;
        min-width: 1.5rem;
        padding: 0 0.4rem;
        border-radius: var(--ds-radius-full, 999px);
        background: var(--ds-bg-sunken);
        color: var(--ds-text-primary);
        font-size: var(--ds-font-size-micro, 0.6875rem);
        font-weight: var(--ds-font-weight-semibold, 600);
        text-align: center;
      }

      .ranked-list-total {
        flex-shrink: 0;
        font-size: var(--ds-font-size-body, 0.875rem);
        font-weight: var(--ds-font-weight-bold, 700);
        font-variant-numeric: tabular-nums;
      }

      .ranked-list-items {
        list-style: none;
        margin: 0;
        padding: 0;
        overflow-y: auto;
      }

      .ranked-list-row {
        display: flex;
        align-items: center;
        gap: var(--ds-space-md, 0.75rem);
        width: 100%;
        padding: var(--ds-space-sm, 0.5rem) var(--ds-space-lg, 1rem);
        border: 0;
        border-bottom: 1px solid var(--ds-border);
        background: transparent;
        color: inherit;
        font: inherit;
        text-align: left;
      }

      .ranked-list-items li:last-child .ranked-list-row {
        border-bottom: 0;
      }

      .ranked-list-row-interactive {
        cursor: pointer;
        transition: background var(--ds-motion-duration-fast, 120ms)
          var(--ds-motion-easing-standard, ease);
      }

      .ranked-list-row-interactive:hover {
        background: var(--ds-surface-container);
      }

      .ranked-list-row-interactive:focus-visible {
        outline: 2px solid var(--ds-border-focus);
        outline-offset: -2px;
      }

      .ranked-list-rank {
        flex-shrink: 0;
        width: 1.5rem;
        color: var(--ds-text-secondary);
        font-size: var(--ds-font-size-micro, 0.6875rem);
        font-variant-numeric: tabular-nums;
        text-align: right;
      }

      /* min-width:0 permite que el título recorte con elipsis en lugar de
         empujar el importe fuera de la tarjeta. */
      .ranked-list-body {
        display: flex;
        flex-direction: column;
        gap: 2px;
        flex: 1 1 auto;
        min-width: 0;
      }

      .ranked-list-title {
        font-size: var(--ds-font-size-body, 0.875rem);
        font-weight: var(--ds-font-weight-medium, 500);
        color: var(--ds-text-primary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .ranked-list-subtitle {
        font-size: var(--ds-font-size-micro, 0.6875rem);
        color: var(--ds-text-secondary);
        font-variant-numeric: tabular-nums;
      }

      .ranked-list-bar-track {
        height: 3px;
        margin-top: 2px;
        border-radius: var(--ds-radius-full, 999px);
        background: var(--ds-bg-sunken);
        overflow: hidden;
      }

      .ranked-list-bar {
        display: block;
        height: 100%;
        border-radius: inherit;
      }

      .ranked-list-amount {
        flex-shrink: 0;
        font-size: var(--ds-font-size-body, 0.875rem);
        font-weight: var(--ds-font-weight-semibold, 600);
        color: var(--ds-text-primary);
        font-variant-numeric: tabular-nums;
      }

      .ranked-list-empty {
        margin: 0;
        padding: var(--ds-space-xl, 1.5rem) var(--ds-space-lg, 1rem);
        color: var(--ds-text-secondary);
        font-size: var(--ds-font-size-body, 0.875rem);
        text-align: center;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppRankedList {
  /** Rótulo del encabezado. Ej: "Morosos". */
  readonly heading = input<string>("");
  /** Filas ya ordenadas por quien las provee; el componente no reordena. */
  readonly items = input.required<RankedListItem[]>();
  /** Total del encabezado. Si se omite, se suma `amount` de los items. */
  readonly total = input<number | undefined>(undefined);
  /** Color de acento para el total y las barras. Usar tokens `var(--ds-*)`. */
  readonly accent = input<string>("var(--ds-primary)");
  readonly format = input<"currency" | "number">("currency");
  readonly decimals = input<number>(0);
  readonly emptyMessage = input<string>("Sin registros.");
  /** Alto máximo del área desplazable. Ej: "24rem". */
  readonly maxHeight = input<string>("none");
  /** Filas enfocables y clicables. */
  readonly interactive = input<boolean>(true);

  readonly itemSelected = output<RankedListItem>();

  /** El total mostrado puede diferir de la suma visible si la lista viene recortada. */
  readonly resolvedTotal = computed(() => {
    const explicitTotal = this.total();
    if (explicitTotal !== undefined) return explicitTotal;
    return this.items().reduce((sum, item) => sum + item.amount, 0);
  });

  /** Mayor importe absoluto: la barra es relativa al máximo, no al total. */
  private readonly peak = computed(() =>
    this.items().reduce((max, item) => Math.max(max, Math.abs(item.amount)), 0),
  );

  share(amount: number): number {
    const peak = this.peak();
    return peak === 0 ? 0 : Math.abs(amount) / peak;
  }

  formatAmount(value: number): string {
    const decimals = this.decimals();
    return this.format() === "currency"
      ? new Intl.NumberFormat("es-MX", {
          style: "currency",
          currency: "MXN",
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(value)
      : new Intl.NumberFormat("es-MX", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(value);
  }
}
