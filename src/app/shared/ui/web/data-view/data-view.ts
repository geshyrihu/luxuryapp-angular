import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  output,
  signal,
  TemplateRef,
} from "@angular/core";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { EmptyState } from "@ui/web/empty-state/empty-state";
import { ButtonModule } from "primeng/button";
import { DataViewModule } from "primeng/dataview";
import { InputTextModule } from "primeng/inputtext";

export type DataViewLayout = "list" | "grid";

@Component({
  selector: "app-data-view",

  imports: [
    CommonModule,
    DataViewModule,
    InputTextModule,
    ButtonModule,
    AppIcon,
    EmptyState,
  ],
  template: `
    <div class="flex align-items-center gap-2 mb-3 flex-wrap">
      @if (globalFilterFields().length) {
        <span class="p-input-icon-left flex-grow-1">
          <i class="pi pi-search"></i>
          <input
            pInputText
            type="text"
            (input)="$filterValue.set($any($event.target).value)"
            [placeholder]="searchPlaceholder()"
            class="w-full"
          />
        </span>
      }
      @if (showLayoutSwitch()) {
        <p-dataViewLayoutOptions
          [layout]="layout()"
          (layoutChange)="layoutChange.emit($event)"
        />
      }
      @if (showAdd()) {
        <p-button
          icon="pi pi-plus"
          [label]="addLabel()"
          severity="primary"
          (onClick)="add.emit()"
        />
      }
    </div>

    @if (loading()) {
      <div class="flex justify-content-center py-5">
        <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
      </div>
    } @else if ($filteredData().length > 0) {
      <p-dataView
        [value]="$filteredData()"
        [layout]="layout()"
        [paginator]="showPaginator()"
        [rows]="rows()"
        [rowsPerPageOptions]="rowsPerPageOptions()"
        [totalRecords]="totalRecords()"
        [lazy]="lazy()"
        (onPage)="pageChange.emit($event)"
        [sortField]="sortField()"
        [sortOrder]="sortOrder()"
      >
        <ng-template let-items pTemplate="list">
          <div class="grid grid-nogutter">
            @for (item of items; track trackByFn($index, item)) {
              <ng-container
                *ngTemplateOutlet="
                  itemTemplate() || defaultItem;
                  context: { $implicit: item, item, layout: 'list' }
                "
              />
            }
          </div>
        </ng-template>
        <ng-template let-items pTemplate="grid">
          <div class="grid">
            @for (item of items; track trackByFn($index, item)) {
              <ng-container
                *ngTemplateOutlet="
                  itemTemplate() || defaultItem;
                  context: { $implicit: item, item, layout: 'grid' }
                "
              />
            }
          </div>
        </ng-template>
      </p-dataView>
    } @else if ($filterValue()) {
      <app-empty-state
        icon="pi pi-search"
        title="Sin resultados"
        [message]="
          'No se encontraron resultados para &quot;' + $filterValue() + '&quot;'
        "
      />
    } @else {
      <app-empty-state
        icon="pi pi-inbox"
        title="Sin registros"
        message="No hay registros disponibles."
      />
    }

    <ng-template #defaultItem let-item="item">
      <div class="col-12 p-3 border-bottom-1 surface-border">
        <pre class="m-0 text-sm">{{ item | json }}</pre>
      </div>
    </ng-template>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataView {
  data = input<any[]>([]);
  loading = input(false);
  layout = input<DataViewLayout>("list");
  showAdd = input(true);
  addLabel = input("Agregar");
  showLayoutSwitch = input(false);
  showPaginator = input(true);
  rows = input(10);
  rowsPerPageOptions = input([10, 20, 50]);
  totalRecords = input(0);
  lazy = input(false);
  sortField = input("");
  sortOrder = input(1);
  globalFilterFields = input<string[]>([]);
  searchPlaceholder = input("Buscar...");

  add = output<void>();
  pageChange = output<any>();
  layoutChange = output<DataViewLayout>();

  itemTemplate = contentChild<TemplateRef<any>>("itemTemplate");

  $filterValue = signal("");

  $filteredData = computed(() => {
    const data = this.data();
    const fields = this.globalFilterFields();
    const val = this.$filterValue().trim().toLowerCase();
    if (!val || !fields.length) return data;
    return data.filter((item) =>
      fields.some((f) =>
        String(item[f] ?? "")
          .toLowerCase()
          .includes(val),
      ),
    );
  });

  trackByFn(index: number, item: any): any {
    return item?.id ?? item?.uuid ?? item?._id ?? index;
  }
}
