import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from "@angular/core";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

export interface PivotDimension {
  field: string;
  label: string;
  sort?: "asc" | "desc";
}

export interface PivotValue {
  field: string;
  label: string;
  aggregator: "sum" | "avg" | "count" | "min" | "max";
  format?: "number" | "currency" | "percent";
}

@Component({
  selector: "app-pivot-table",

  imports: [AppIcon],
  template: `
    <div class="pivot-root">
      @if (title()) {
        <div class="pivot-header">
          <strong>{{ title() }}</strong>
          <span class="pivot-summary">{{ summaryText() }}</span>
        </div>
      }
      <div class="pivot-table-wrapper">
        <table class="pivot-table">
          <thead>
            <tr>
              <th class="pivot-corner"></th>
              @for (col of columnHeaders(); track col.key) {
                <th class="pivot-col-header" [attr.colspan]="col.colspan">
                  {{ col.label }}
                </th>
              }
              <th class="pivot-total-col">Total</th>
            </tr>
          </thead>
          <tbody>
            @for (row of treeRows(); track row.key) {
              <tr
                [class]="'pivot-row-level-' + row.level"
                [class.pivot-row-expanded]="row.expanded"
              >
                <td class="pivot-row-header" (click)="toggleRow(row)">
                  <span
                    class="pivot-indent"
                    [style.paddingLeft.px]="row.level * 20"
                  ></span>
                  @if (row.children?.length) {
                    <app-icon
                      [icon]="
                        row.expanded ? 'mdi:chevron-down' : 'mdi:chevron-right'
                      "
                      class="text-xs"
                    />
                  } @else {
                    <span class="pivot-leaf-icon"></span>
                  }
                  <span class="pivot-row-label">{{ row.label }}</span>
                </td>
                @for (cell of row.cells; track cell.colKey) {
                  <td
                    class="pivot-cell"
                    [class.pivot-cell-total]="cell.isTotal"
                  >
                    {{ formatValue(cell.value) }}
                  </td>
                }
                <td class="pivot-total-cell">
                  {{ formatValue(row.rowTotal) }}
                </td>
              </tr>
            }
          </tbody>
          <tfoot>
            <tr class="pivot-footer">
              <td class="pivot-row-header">Total general</td>
              @for (col of columnHeaders(); track col.key) {
                <td class="pivot-cell pivot-cell-total">
                  {{ formatValue(col.total) }}
                </td>
              }
              <td class="pivot-total-cell">{{ formatValue(grandTotal()) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  `,
  styles: [
    `
      .pivot-root {
        background: var(--ds-bg-surface);
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-lg);
        overflow: hidden;
      }
      .pivot-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1rem;
        background: var(--ds-bg-elevated);
        border-bottom: 1px solid var(--ds-border);
        font-size: var(--ds-font-size-body);
        color: var(--ds-text-primary);
      }
      .pivot-summary {
        font-size: var(--ds-font-size-table);
        color: var(--ds-text-muted);
      }
      .pivot-table-wrapper {
        overflow-x: auto;
      }
      .pivot-table {
        width: 100%;
        border-collapse: collapse;
        font-size: var(--ds-font-size-table);
      }
      .pivot-table th,
      .pivot-table td {
        padding: 0.5rem 0.75rem;
        border: 1px solid var(--ds-border);
        text-align: right;
        white-space: nowrap;
      }
      .pivot-corner {
        background: var(--ds-bg-elevated);
        min-width: 160px;
      }
      .pivot-col-header {
        background: var(--ds-bg-elevated);
        font-weight: var(--ds-font-weight-semibold);
        color: var(--ds-text-primary);
        text-align: center;
      }
      .pivot-row-header {
        text-align: left;
        font-weight: var(--ds-font-weight-medium);
        color: var(--ds-text-primary);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }
      .pivot-indent {
        flex-shrink: 0;
      }
      .pivot-leaf-icon {
        width: 1rem;
        display: inline-block;
      }
      .pivot-row-label {
        flex: 1;
      }
      .pivot-row-level-1 {
        background: var(--ds-bg-elevated);
      }
      .pivot-row-level-1 .pivot-row-header {
        padding-left: 0.5rem;
      }
      .pivot-cell {
        color: var(--ds-text-primary);
      }
      .pivot-cell-total {
        font-weight: var(--ds-font-weight-semibold);
        background: var(--ds-bg-sunken);
      }
      .pivot-total-col,
      .pivot-total-cell {
        font-weight: var(--ds-font-weight-bold);
        background: var(--ds-bg-elevated);
      }
      .pivot-footer .pivot-cell,
      .pivot-footer .pivot-total-cell {
        font-weight: var(--ds-font-weight-bold);
        border-top: 2px solid var(--ds-border-strong);
      }
      .pivot-row-expanded {
        background: color-mix(in srgb, var(--ds-primary) 5%, transparent);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class PivotTable {
  title = input<string>();
  data = input.required<any[]>();
  rows = input.required<PivotDimension[]>();
  columns = input.required<PivotDimension>();
  values = input.required<PivotValue[]>();

  private aggCache = computed(() => {
    const raw = this.data();
    const rowDims = this.rows();
    const colDim = this.columns();
    const vals = this.values();
    return this.buildPivot(raw, rowDims, colDim, vals);
  });

  columnHeaders = computed(() => this.aggCache().columns);
  treeRows = computed(() => this.aggCache().tree);
  grandTotal = computed(() => this.aggCache().grandTotal);

  summaryText = computed(() => {
    const total = this.formatValue(this.grandTotal());
    return `Total: ${total}`;
  });

  toggleRow(row: any): void {
    row.expanded = !row.expanded;
  }

  formatValue(val: number | null): string {
    if (val === null || val === undefined) return "-";
    const fmt = this.values()[0]?.format || "number";
    switch (fmt) {
      case "currency":
        return `$${val.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case "percent":
        return `${(val * 100).toFixed(1)}%`;
      default:
        return val.toLocaleString("es-MX", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        });
    }
  }

  private buildPivot(
    data: any[],
    rowDims: PivotDimension[],
    colDim: PivotDimension,
    vals: PivotValue[],
  ): { columns: any[]; tree: any[]; grandTotal: number } {
    const colGroups = this.groupBy(data, colDim.field);
    const colKeys = Object.keys(colGroups).sort();

    const columns = colKeys.map((k) => ({
      key: k,
      label: k,
      colspan: vals.length,
      total: 0,
    }));
    if (columns.length === 0)
      columns.push({
        key: "_empty",
        label: "(sin datos)",
        colspan: vals.length,
        total: 0,
      });

    const tree = this.buildTree(data, rowDims, 0, colKeys, vals, columns);
    const grandTotal = tree.reduce((s, r) => s + (r.rowTotal || 0), 0);

    return { columns, tree, grandTotal };
  }

  private buildTree(
    data: any[],
    rowDims: PivotDimension[],
    level: number,
    colKeys: string[],
    vals: PivotValue[],
    columns: any[],
  ): any[] {
    if (level >= rowDims.length) {
      const cells = colKeys.map((ck) => {
        const match = data.find(
          (d) => d[rowDims[rowDims.length - 1].field] === ck,
        );
        const val = match ? this.aggregate([match], vals[0]) : 0;
        return { colKey: ck, value: val, isTotal: false };
      });
      const rowTotal = cells.reduce((s, c) => s + (c.value || 0), 0);
      return [
        {
          key: `leaf-${level}-${data.length}`,
          label: data[0]?.[rowDims[rowDims.length - 1].field] ?? "(vacío)",
          level,
          expanded: false,
          cells,
          rowTotal,
          children: [],
        },
      ];
    }

    const dim = rowDims[level];
    const groups = this.groupBy(data, dim.field);
    const result: any[] = [];

    for (const [key, group] of Object.entries(groups)) {
      const children = this.buildTree(
        group as any[],
        rowDims,
        level + 1,
        colKeys,
        vals,
        columns,
      );
      const cells = colKeys.map((ck, ci) => {
        const val = children.reduce(
          (s, ch) => s + (ch.cells[ci]?.value || 0),
          0,
        );
        columns[ci].total += val;
        return { colKey: ck, value: val, isTotal: false };
      });
      const rowTotal = cells.reduce((s, c) => s + (c.value || 0), 0);
      result.push({
        key: `group-${level}-${key}`,
        label: key,
        level,
        expanded: false,
        cells,
        rowTotal,
        children,
      });
    }
    return result;
  }

  private groupBy(data: any[], field: string): Record<string, any[]> {
    const map: Record<string, any[]> = {};
    for (const item of data) {
      const key = item[field] ?? "(vacío)";
      (map[key] || (map[key] = [])).push(item);
    }
    return map;
  }

  private aggregate(items: any[], value: PivotValue): number {
    const vals = items.map((i) => Number(i[value.field]) || 0);
    switch (value.aggregator) {
      case "sum":
        return vals.reduce((a, b) => a + b, 0);
      case "avg":
        return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      case "count":
        return vals.length;
      case "min":
        return Math.min(...vals);
      case "max":
        return Math.max(...vals);
      default:
        return vals.reduce((a, b) => a + b, 0);
    }
  }
}
