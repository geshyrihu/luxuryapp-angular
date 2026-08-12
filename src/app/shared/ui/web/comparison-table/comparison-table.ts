import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from "@angular/core";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

export interface ComparisonItem {
  feature: string;
  [key: string]: string | number | boolean | undefined;
}

@Component({
  selector: "app-comparison-table",

  imports: [AppIcon],
  template: `
    <div
      class="comparison-table-root"
      [class.comparison-table-scrollable]="scrollable()"
    >
      <table class="comparison-table">
        <thead>
          <tr>
            <th class="comparison-feature-header">Característica</th>
            @for (col of columns(); track col) {
              <th
                class="comparison-col-header"
                [class.comparison-col-highlight]="col === highlightColumn()"
              >
                <strong>{{ col }}</strong>
              </th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of items(); track row) {
            <tr>
              <td class="comparison-feature-cell">{{ row.feature }}</td>
              @for (col of columns(); track col) {
                <td
                  class="comparison-value-cell"
                  [class.comparison-col-highlight]="col === highlightColumn()"
                >
                  @if (col === highlightColumn() && showCheckmark()) {
                    <app-icon
                      icon="material-symbols-light:check-circle"
                      style="color:var(--ds-success)"
                      style="font-size: 1.1rem"
                    />
                  }
                  {{ getCellValue(row, col) }}
                </td>
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [
    `
      .comparison-table-root {
        background: var(--ds-bg-surface);
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-lg);
        overflow: hidden;
      }
      .comparison-table-scrollable {
        overflow-x: auto;
      }
      .comparison-table {
        width: 100%;
        border-collapse: collapse;
        font-size: var(--ds-font-size-table);
      }
      .comparison-table th,
      .comparison-table td {
        padding: 0.625rem 1rem;
        text-align: left;
        border-bottom: 1px solid var(--ds-border);
      }
      .comparison-table thead th {
        background: var(--ds-bg-elevated);
        color: var(--ds-text-secondary);
        font-size: var(--ds-font-size-help);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        position: sticky;
        top: 0;
        z-index: 1;
      }
      .comparison-feature-header {
        min-width: 160px;
      }
      .comparison-col-header {
        min-width: 140px;
        text-align: center;
      }
      .comparison-col-highlight {
        background: color-mix(
          in srgb,
          var(--ds-primary) 8%,
          transparent
        ) !important;
      }
      .comparison-col-highlight.comparison-col-header strong {
        color: var(--ds-primary);
      }
      .comparison-feature-cell {
        font-weight: 500;
        color: var(--ds-text-primary);
      }
      .comparison-value-cell {
        text-align: center;
        color: var(--ds-text-secondary);
      }
      .comparison-table tbody tr:last-child td {
        border-bottom: none;
      }
      .comparison-table tbody tr:hover {
        background: var(--ds-bg-hover);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class ComparisonTable {
  items = input.required<ComparisonItem[]>();
  highlightColumn = input<string>("");
  scrollable = input<boolean>(false);
  showCheckmark = input<boolean>(true);

  columns = computed(() => {
    const cols = new Set<string>();
    for (const item of this.items()) {
      for (const key of Object.keys(item)) {
        if (key !== "feature") {
          cols.add(key);
        }
      }
    }
    return Array.from(cols);
  });

  getCellValue(row: ComparisonItem, col: string): string {
    const value = row[col];
    if (value === true) return "✓";
    if (value === false || value === undefined || value === null) return "—";
    return String(value);
  }
}
