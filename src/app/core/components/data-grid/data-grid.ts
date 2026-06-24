import { Component, input, model, output, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";
import { DatePickerModule } from "primeng/datepicker";
import { FormsModule } from "@angular/forms";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";

export interface DataGridColumn {
  field: string;
  header: string;
  type?: "text" | "number" | "select" | "date" | "boolean" | "currency" | "icon";
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
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    FormsModule,
    AppIcon,
  ],
  template: `
    <div class="data-grid-root">
      @if (title() || globalFilter()) {
        <div class="data-grid-toolbar flex align-items-center gap-2 flex-wrap mb-2">
          @if (title()) {
            <strong class="data-grid-title">{{ title() }}</strong>
          }
          <div class="flex-1"></div>
          @if (globalFilter()) {
            <input
              pInputText
              [(ngModel)]="globalFilterValue"
              (input)="onGlobalFilter($event)"
              [placeholder]="'Buscar...'"
              class="p-inputtext-sm"
            />
          }
          @if (showActions()) {
            <p-button
              [label]="'Agregar'"
              icon="mdi:plus"
              severity="primary"
              size="small"
              (onClick)="addRow.emit()"
            />
          }
        </div>
      }

      <p-table
        [value]="data()"
        [columns]="cols()"
        [dataKey]="dataKey()"
        [loading]="loading()"
        [paginator]="paginator()"
        [rows]="rows()"
        [rowsPerPageOptions]="rowsPerPageOptions()"
        [totalRecords]="totalRecords()"
        [globalFilterFields]="globalFilterFields()"
        [sortField]="sortField()"
        [sortOrder]="sortOrder()"
        [selectionMode]="selectionMode()"
        [selection]="selection()"
        (selectionChange)="selectionChange.emit($event)"
        [scrollable]="scrollable()"
        [scrollHeight]="scrollHeight()"
        [virtualScroll]="virtualScroll()"
        [virtualScrollItemSize]="virtualScrollItemSize()"
        [editMode]="editMode()"
        [resizableColumns]="resizableColumns()"
        [reorderableColumns]="reorderableColumns()"
        [showGridlines]="showGridlines()"
        [rowHover]="true"
        [lazy]="lazy()"
        (onLazyLoad)="onLazyLoad.emit($event)"
        (onPage)="onPage.emit($event)"
        (onSort)="onSort.emit($event)"
        (onFilter)="onFilter.emit($event)"
        (onRowSelect)="onRowSelect.emit($event)"
        (onRowUnselect)="onRowUnselect.emit($event)"
        styleClass="w-full"
        tableStyleClass="w-full"
      >
        <ng-template pTemplate="header" let-columns>
          <tr>
            @if (selectionMode() === "multiple") {
              <th style="width: 3rem">
                <p-tableHeaderCheckbox />
              </th>
            }
            @for (col of columns; track col.field) {
              <th
                [pSortableColumn]="col.sortable ? col.field : null"
                [style]="{ width: col.width, 'min-width': col.minWidth }"
                [class]="col.styleClass"
              >
                <div class="flex align-items-center gap-1">
                  @if (col.icon) {
                    <app-icon [icon]="col.icon" class="text-sm" />
                  }
                  {{ col.header }}
                  @if (col.sortable) {
                    <p-sortIcon [field]="col.field" />
                  }
                </div>
                @if (col.filterable) {
                  <div class="mt-1">
                    <input
                      pInputText
                      (input)="onColumnFilter($event, col.field)"
                      class="p-inputtext-sm w-full"
                      [placeholder]="'Filtrar...'"
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

        <ng-template pTemplate="body" let-row let-columns="columns" let-index="rowIndex">
          <tr>
            @if (selectionMode() === "multiple") {
              <td>
                <p-tableCheckbox [value]="row" />
              </td>
            }
            @for (col of columns; track col.field) {
              <td [style]="{ width: col.width, 'min-width': col.minWidth }">
                @if (editMode() && col.editable) {
                  @if (col.type === "select") {
                    <p-select
                      [(ngModel)]="row[col.field]"
                      [options]="col.options || []"
                      optionLabel="label"
                      optionValue="value"
                      styleClass="w-full"
                    />
                  } @else if (col.type === "date") {
                    <p-datePicker
                      [(ngModel)]="row[col.field]"
                      styleClass="w-full"
                    />
                  } @else {
                    <input
                      pInputText
                      [(ngModel)]="row[col.field]"
                      class="w-full"
                    />
                  }
                } @else {
                  @if (col.type === "currency") {
                    {{ formatCurrency(row[col.field]) }}
                  } @else if (col.type === "boolean") {
                    <app-icon
                      [icon]="row[col.field] ? 'mdi:check-circle' : 'mdi:close-circle'"
                      [style.color]="row[col.field] ? 'var(--ds-success)' : 'var(--ds-text-muted)'"
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
                <div class="flex gap-1">
                  <p-button
                    [rounded]="true"
                    [text]="true"
                    size="small"
                    severity="info"
                    (onClick)="editRow.emit(row)"
                  >
                    <app-icon icon="mdi:pencil" />
                  </p-button>
                  <p-button
                    [rounded]="true"
                    [text]="true"
                    size="small"
                    severity="danger"
                    (onClick)="deleteRow.emit(row)"
                  >
                    <app-icon icon="mdi:delete" />
                  </p-button>
                </div>
              </td>
            }
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <div class="p-4 text-center text-color-secondary">
            <app-icon icon="mdi:table-off" class="text-2xl mb-2" />
            <p class="text-sm m-0">{{ emptyMessage() }}</p>
          </div>
        </ng-template>
      </p-table>
    </div>
  `,
  styles: [`
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
  `],
  encapsulation: ViewEncapsulation.None,
})
export class DataGrid {
  data = input.required<any[]>();
  columns = input.required<DataGridColumn[]>();
  dataKey = input<string>("id");
  loading = input<boolean>(false);
  selectionMode = input<"single" | "multiple" | undefined>(undefined);
  selection = model<any>(undefined);
  paginator = input<boolean>(true);
  rows = input<number>(20);
  rowsPerPageOptions = input<number[]>([10, 20, 50, 100]);
  totalRecords = input<number>(0);
  globalFilter = input<boolean>(false);
  globalFilterFields = input<string[]>([]);
  sortField = input<string>("");
  sortOrder = input<number>(1);
  scrollable = input<boolean>(false);
  scrollHeight = input<string>("400px");
  virtualScroll = input<boolean>(false);
  virtualScrollItemSize = input<number>(40);
  editMode = input<"cell" | "row" | undefined>(undefined);
  resizableColumns = input<boolean>(false);
  reorderableColumns = input<boolean>(false);
  showGridlines = input<boolean>(true);
  lazy = input<boolean>(false);
  title = input<string>("");
  showActions = input<boolean>(true);
  emptyMessage = input<string>("Sin registros disponibles");

  globalFilterValue: string = "";

  selectionChange = output<any>();
  onLazyLoad = output<any>();
  onPage = output<any>();
  onSort = output<any>();
  onFilter = output<any>();
  onRowSelect = output<any>();
  onRowUnselect = output<any>();
  addRow = output<void>();
  editRow = output<any>();
  deleteRow = output<any>();

  cols = this.columns;

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
