import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import {
  AppTable,
  AppSorticon,
  AppTableCheckbox,
  AppTableHeaderCheckbox,
} from "@ui/web/table/table";

export interface DataGridColumn {
  field: string;
  header: string;
  type?:
    "text" | "number" | "select" | "date" | "boolean" | "currency" | "icon";
  editable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  minWidth?: string;
  options?: { label: string; value: any }[];
  icon?: string;
  format?: (value: any) => string;
}

@Component({
  selector: "app-data-grid",
  imports: [
    AppTable,
    AppSorticon,
    AppTableCheckbox,
    AppTableHeaderCheckbox,
    FormsModule,
    AppIcon,
    WebButtonLabel,
    WebButtonIcon,
  ],
  template: `
    <div class="data-grid-root">
      @if (title() || globalFilter()) {
        <div
          class="data-grid-toolbar d-flex align-items-center gap-2 flex-wrap mb-2"
        >
          @if (title()) {
            <strong class="data-grid-title">{{ title() }}</strong>
          }
          <div class="flex-1"></div>
          @if (globalFilter()) {
            <input
              [(ngModel)]="globalFilterValue"
              (input)="onGlobalFilter($event)"
              placeholder="Buscar..."
              class="form-control form-control-sm"
              style="width: auto"
            />
          }
          @if (showActions()) {
            <il-button
              label="Agregar"
              iconClass="material-symbols-light:add"
              severity="primary"
              size="sm"
              (clicked)="addRow.emit()"
            />
          }
        </div>
      }

      <app-table
        #dt
        [value]="data()"
        [dataKey]="dataKey()"
        [loading]="loading()"
        [paginator]="paginator()"
        [rows]="rows()"
        [rowsPerPageOptions]="rowsPerPageOptions()"
        [totalRecords]="totalRecords()"
        [globalFilterFields]="globalFilterFields()"
        [(selection)]="selection"
        [reorderableColumns]="reorderableColumns()"
        [scrollable]="scrollable()"
        [scrollHeight]="scrollHeight()"
        [lazy]="lazy()"
        (onPage)="onPage.emit($event)"
      >
        <ng-template #header>
          <tr>
            @if (selectionMode() === "multiple") {
              <th style="width: 3rem">
                <app-table-header-checkbox />
              </th>
            }
            @for (col of columns(); track col.field) {
              <th
                [style]="{ width: col.width, 'min-width': col.minWidth }"
                [class]="col.styleClass"
                [class.cursor-pointer]="col.sortable"
                (click)="col.sortable && dt.sort(col.field)"
              >
                <div class="d-flex align-items-center gap-1">
                  @if (col.icon) {
                    <app-icon [icon]="col.icon" class="text-sm" />
                  }
                  {{ col.header }}
                  @if (col.sortable) {
                    <app-sorticon [field]="col.field" />
                  }
                </div>
                @if (col.filterable) {
                  <div class="mt-1">
                    <input
                      (input)="onColumnFilter($event, col.field)"
                      class="form-control form-control-sm w-100"
                      placeholder="Filtrar..."
                    />
                  </div>
                }
              </th>
            }
            @if (showActions()) {
              <th style="width: 6rem">Acciones</th>
            }
          </tr>
        </ng-template>

        <ng-template #body let-row>
          <tr>
            @if (selectionMode() === "multiple") {
              <td>
                <app-table-selection-checkbox [value]="row" />
              </td>
            }
            @for (col of columns(); track col.field) {
              <td [style]="{ width: col.width, 'min-width': col.minWidth }">
                @if (editMode() && col.editable) {
                  @if (col.type === "select") {
                    <select
                      [(ngModel)]="row[col.field]"
                      class="form-select form-select-sm"
                    >
                      @for (opt of col.options || []; track opt.value) {
                        <option [value]="opt.value">{{ opt.label }}</option>
                      }
                    </select>
                  } @else if (col.type === "date") {
                    <input
                      type="date"
                      [(ngModel)]="row[col.field]"
                      class="form-control form-control-sm"
                    />
                  } @else {
                    <input
                      [(ngModel)]="row[col.field]"
                      class="form-control form-control-sm"
                    />
                  }
                } @else {
                  @if (col.type === "currency") {
                    {{ formatCurrency(row[col.field]) }}
                  } @else if (col.type === "boolean") {
                    <app-icon
                      [icon]="
                        row[col.field] ? 'material-symbols-light:check-circle' : 'material-symbols-light:cancel'
                      "
                      [style.color]="
                        row[col.field]
                          ? 'var(--ds-success)'
                          : 'var(--ds-text-muted)'
                      "
                    />
                  } @else if (col.format) {
                    {{ col.format(row[col.field]) }}
                  } @else {
                    {{ row[col.field] }}
                  }
                }
              </td>
            }
            @if (showActions()) {
              <td>
                <div class="d-flex gap-1">
                  <iw-button
                    iconClass="material-symbols-light:edit"
                    severity="info"
                    size="sm"
                    [rounded]="true"
                    [text]="true"
                    (clicked)="editRow.emit(row)"
                  />
                  <iw-button
                    iconClass="material-symbols-light:delete"
                    severity="danger"
                    size="sm"
                    [rounded]="true"
                    [text]="true"
                    (clicked)="deleteRow.emit(row)"
                  />
                </div>
              </td>
            }
          </tr>
        </ng-template>

        <ng-template #emptymessage>
          <tr>
            <td [attr.colspan]="columns().length + (showActions() ? 1 : 0) + (selectionMode() === 'multiple' ? 1 : 0)">
              <div class="p-4 text-center text-color-secondary">
                <app-icon icon="material-symbols-light:table-view" class="text-2xl mb-2" />
                <p class="text-sm m-0">{{ emptyMessage() }}</p>
              </div>
            </td>
          </tr>
        </ng-template>
      </app-table>
    </div>
  `,
  styles: [
    `
      .data-grid-root {
        width: 100%;
      }
      .data-grid-toolbar {
        padding: 0.5rem 0;
      }
      .data-grid-title {
        font-size: var(--ds-font-size-section-title);
        color: var(--ds-text-primary);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DataGrid {
  data = input.required<any[]>();
  columns = input.required<DataGridColumn[]>();
  dataKey = input<string>("id");
  loading = input<boolean>(false);
  selectionMode = input<"single" | "multiple" | undefined>(undefined);
  selection = model<any[]>([]);
  paginator = input<boolean>(true);
  rows = input<number>(20);
  rowsPerPageOptions = input<number[]>([10, 20, 50, 100]);
  totalRecords = input<number>(0);
  globalFilter = input<boolean>(false);
  globalFilterFields = input<string[]>([]);
  scrollable = input<boolean>(false);
  scrollHeight = input<string>("400px");
  editMode = input<"cell" | "row" | undefined>(undefined);
  reorderableColumns = input<boolean>(false);
  lazy = input<boolean>(false);
  title = input<string>("");
  showActions = input<boolean>(true);
  emptyMessage = input<string>("Sin registros disponibles");

  globalFilterValue: string = "";

  onPage = output<any>();
  onFilter = output<any>();
  addRow = output<void>();
  editRow = output<any>();
  deleteRow = output<any>();

  onGlobalFilter(event: Event): void {
    this.globalFilterValue = (event.target as HTMLInputElement).value;
  }

  onColumnFilter(event: Event, field: string): void {
    const value = (event.target as HTMLInputElement).value;
    this.onFilter.emit({ field, value });
  }

  formatCurrency(value: any): string {
    if (value == null) return "";
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);
  }
}
