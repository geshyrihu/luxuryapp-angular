import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from "@angular/core";

export interface HeatmapCell {
  row: string;
  col: string;
  value: number;
}

/**
 * AppHeatmap — Mapa de calor en grid CSS con interpolación de color.
 * Uso: actividad por hora/día, distribución de ventas, densidad de eventos.
 */
@Component({
  selector: "app-heatmap",

  imports: [],
  template: `
    <div class="hm-root">
      @if (title()) {
        <h4 class="hm-title">{{ title() }}</h4>
      }

      <div class="hm-scroll">
        <table class="hm-table" role="grid">
          <!-- Column headers -->
          <thead>
            <tr>
              <th class="hm-corner"></th>
              @for (col of cols(); track col) {
                <th class="hm-col-header">{{ col }}</th>
              }
            </tr>
          </thead>
          <!-- Rows -->
          <tbody>
            @for (row of rows(); track row) {
              <tr>
                <th class="hm-row-header">{{ row }}</th>
                @for (col of cols(); track col) {
                  <td
                    class="hm-cell"
                    [style.background]="cellColor(row, col)"
                    [title]="cellTitle(row, col)"
                    [attr.aria-label]="
                      row + ' ' + col + ': ' + cellValue(row, col)
                    "
                  >
                    @if (showValues()) {
                      <span
                        class="hm-value"
                        [style.color]="cellTextColor(row, col)"
                      >
                        {{ cellValue(row, col) }}
                      </span>
                    }
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Legend -->
      <div class="hm-legend">
        <span class="hm-legend-label">{{ minLabel() }}</span>
        <div class="hm-legend-bar"></div>
        <span class="hm-legend-label">{{ maxLabel() }}</span>
      </div>
    </div>
  `,
  styles: [
    `
      .hm-root {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .hm-title {
        font-size: var(--ds-font-size-label, 0.875rem);
        font-weight: 600;
        color: var(--ds-text-primary);
        margin: 0;
      }
      .hm-scroll {
        overflow-x: auto;
      }
      .hm-table {
        border-collapse: collapse;
        min-width: 100%;
      }
      .hm-corner {
        width: 60px;
      }
      .hm-col-header {
        font-size: var(--ds-font-size-micro, 0.75rem);
        font-weight: 600;
        color: var(--ds-text-secondary);
        padding: 0 4px 4px;
        text-align: center;
        min-width: 32px;
      }
      .hm-row-header {
        font-size: var(--ds-font-size-micro, 0.75rem);
        font-weight: 600;
        color: var(--ds-text-secondary);
        padding: 2px 8px 2px 0;
        text-align: right;
        white-space: nowrap;
      }
      .hm-cell {
        width: 32px;
        height: 24px;
        border-radius: 3px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        cursor: default;
        transition: opacity 0.15s;
      }
      .hm-cell:hover {
        opacity: 0.85;
        outline: 2px solid var(--ds-primary, #003d9b);
      }
      .hm-value {
        font-size: 0.6rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
      }
      /* Legend */
      .hm-legend {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .hm-legend-label {
        font-size: var(--ds-font-size-micro, 0.75rem);
        color: var(--ds-text-muted);
      }
      .hm-legend-bar {
        flex: 1;
        height: 10px;
        border-radius: 5px;
        background: linear-gradient(to right, #edf1ff, #003d9b);
        max-width: 180px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppHeatmap {
  data = input<HeatmapCell[]>([]);
  title = input<string>("");
  showValues = input<boolean>(false);
  minLabel = input<string>("Bajo");
  maxLabel = input<string>("Alto");
  colorLow = input<string>("#edf1ff");
  colorHigh = input<string>("#003d9b");

  rows = computed(() => [...new Set(this.data().map((d) => d.row))]);
  cols = computed(() => [...new Set(this.data().map((d) => d.col))]);

  private cellMap = computed(() => {
    const map = new Map<string, number>();
    for (const d of this.data()) map.set(`${d.row}|${d.col}`, d.value);
    return map;
  });

  private minMax = computed(() => {
    const vals = this.data().map((d) => d.value);
    return { min: Math.min(...vals, 0), max: Math.max(...vals, 1) };
  });

  cellValue(row: string, col: string): number {
    return this.cellMap().get(`${row}|${col}`) ?? 0;
  }

  cellTitle(row: string, col: string): string {
    return `${row} / ${col}: ${this.cellValue(row, col)}`;
  }

  cellColor(row: string, col: string): string {
    const { min, max } = this.minMax();
    const t = (this.cellValue(row, col) - min) / (max - min || 1);
    return this.lerp(this.colorLow(), this.colorHigh(), t);
  }

  cellTextColor(row: string, col: string): string {
    const { min, max } = this.minMax();
    const t = (this.cellValue(row, col) - min) / (max - min || 1);
    return t > 0.55 ? "#fff" : "#041b3c";
  }

  private lerp(c1: string, c2: string, t: number): string {
    const p1 = this.hexToRgb(c1);
    const p2 = this.hexToRgb(c2);
    if (!p1 || !p2) return c1;
    const r = Math.round(p1.r + (p2.r - p1.r) * t);
    const g = Math.round(p1.g + (p2.g - p1.g) * t);
    const b = Math.round(p1.b + (p2.b - p1.b) * t);
    return `rgb(${r},${g},${b})`;
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const m = hex.replace("#", "").match(/.{2}/g);
    if (!m || m.length < 3) return null;
    return {
      r: parseInt(m[0], 16),
      g: parseInt(m[1], 16),
      b: parseInt(m[2], 16),
    };
  }
}
