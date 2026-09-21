import { NgStyle, NgTemplateOutlet } from "@angular/common";
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  model,
  output,
  signal,
  TemplateRef,
  ViewEncapsulation,
} from "@angular/core";
import { AppIcon } from "@ui/shared/app-icon/app-icon";

@Directive({
  selector: "[appSortableColumn]",
  host: {
    role: "button",
    tabindex: "0",
    class: "app-table-sortable-column",
    "[class.app-table-sorted]": "isActive()",
    "(click)": "onActivate()",
    "(keydown.enter)": "onActivate()",
  },
})
export class AppSortableColumn {
  appSortableColumn = input.required<string>();
  private table = inject(AppTable);
  protected isActive = computed(
    () => this.table.sortField() === this.appSortableColumn(),
  );

  protected onActivate(): void {
    this.table.sort(this.appSortableColumn());
  }
}

@Directive({
  selector: "[pReorderableRowHandle]",
  host: {
    class: "app-table-row-handle",
    draggable: "true",
  },
})
export class AppReorderableRowHandle {}

@Directive({
  selector: "[pReorderableRow]",
  host: {
    class: "app-table-reorderable-row",
    "[class.app-table-row-dragover]": "isDragOver()",
    "(dragstart)": "onDragStart($event)",
    "(dragover)": "onDragOver($event)",
    "(dragleave)": "onDragLeave()",
    "(drop)": "onDrop($event)",
    "(dragend)": "onDragEnd()",
  },
})
export class AppReorderableRow {
  pReorderableRow = input.required<number>();
  private table = inject(AppTable);
  private host = inject(ElementRef<HTMLElement>);
  protected isDragOver = signal(false);

  protected onDragStart(event: DragEvent): void {
    if (!this.table.reorderableRows()) {
      event.preventDefault();
      return;
    }
    const handle = this.host.nativeElement.querySelector(".app-table-row-handle");
    if (
      !handle ||
      !(event.target === handle || handle.contains(event.target as Node))
    ) {
      event.preventDefault();
      return;
    }
    this.table.startRowDrag(this.pReorderableRow());
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.dropEffect = "move";
    }
    event.dataTransfer?.setData("text/plain", String(this.pReorderableRow()));
  }

  protected onDragOver(event: DragEvent): void {
    if (!this.table.reorderableRows()) return;
    event.preventDefault();
    this.isDragOver.set(true);
  }

  protected onDragLeave(): void {
    this.isDragOver.set(false);
  }

  protected onDrop(event: DragEvent): void {
    if (!this.table.reorderableRows()) return;
    event.preventDefault();
    this.isDragOver.set(false);
    this.table.dropRow(this.pReorderableRow());
  }

  protected onDragEnd(): void {
    this.isDragOver.set(false);
    this.table.endRowDrag();
  }
}

@Directive({
  selector: "[pFrozenColumn]",
  host: {
    class: "app-table-frozen-column",
    "[attr.data-frozen-align]": "alignFrozen()",
  },
})
export class AppFrozenColumn {
  alignFrozen = input<"left" | "right">("left");
}

@Component({
  selector: "app-sorticon",
  imports: [AppIcon],
  template: `
    <span class="app-table-sorticon">
      @if (table.sortField() === field()) {
        @if (table.sortOrder() === 1) {
          <app-icon icon="material-symbols-light:arrow-upward" />
        } @else {
          <app-icon icon="material-symbols-light:arrow-downward" />
        }
      } @else {
        <app-icon
          icon="material-symbols-light:swap-vert"
          class="app-table-sorticon-neutral"
        />
      }
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppSorticon {
  field = input.required<string>();
  protected table = inject(AppTable);
}

@Component({
  selector: "app-table-selection-checkbox",
  template: `
    <input
      type="checkbox"
      class="form-check-input"
      [checked]="table.isSelected(value())"
      (click)="$event.stopPropagation()"
      (change)="table.toggleSelection(value())"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppTableCheckbox {
  value = input.required<unknown>();
  protected table = inject(AppTable);
}

@Component({
  selector: "app-table-header-checkbox",
  template: `
    <input
      type="checkbox"
      class="form-check-input"
      [checked]="allSelected()"
      (change)="table.toggleAllSelection()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppTableHeaderCheckbox {
  protected table = inject(AppTable);
  protected allSelected = computed(() => {
    const rows = this.table.pagedValue();
    return rows.length > 0 && rows.every((row) => this.table.isSelected(row));
  });
}

/**
 * Evento de cambio para tablas server-side (`[lazy]="true"`).
 * Mantiene los nombres de `TableLazyLoadEvent` de PrimeNG para que los
 * consumidores migrados no necesiten cambiar sus handlers.
 */
export interface AppTableLazyEvent {
  first: number;
  rows: number;
  globalFilter: string;
  sortField: string | null;
  sortOrder: 1 | -1;
}

@Component({
  selector: "app-table",
  host: { class: "app-table" },
  imports: [NgStyle, NgTemplateOutlet],
  template: `
    @if (captionTpl(); as caption) {
      <div class="app-table-caption">
        <ng-container [ngTemplateOutlet]="caption" />
      </div>
    }
    <div
      class="app-table-scroll"
      [style.max-height]="scrollable() ? scrollHeight() : null"
    >
      <table
        class="app-table-table table"
        [class.app-table-sm]="size() === 'small'"
        [ngStyle]="tableStyle()"
      >
        <ng-container [ngTemplateOutlet]="colgroupTpl() ?? null" />
        <thead
          class="app-table-thead"
          (dragstart)="onColDragStart($event)"
          (dragover)="onColDragOver($event)"
          (drop)="onColDrop($event)"
        >
          <ng-container [ngTemplateOutlet]="headerTpl() ?? null" />
        </thead>
        <tbody class="app-table-tbody">
          @if (pagedValue().length === 0) {
            <ng-container [ngTemplateOutlet]="emptymessageTpl() ?? null" />
          } @else {
            @for (item of pagedValue(); track $index; let i = $index) {
              @if (groupheaderTpl(); as groupheader) {
                @if (isNewGroup(item, i)) {
                  <ng-container
                    [ngTemplateOutlet]="groupheader"
                    [ngTemplateOutletContext]="{ $implicit: item }"
                  />
                }
              }
              <ng-container
                [ngTemplateOutlet]="bodyTpl() ?? null"
                [ngTemplateOutletContext]="{ $implicit: item, rowIndex: i }"
              />
              @if (groupfooterTpl(); as groupfooter) {
                @if (isEndOfGroup(item, i)) {
                  <ng-container
                    [ngTemplateOutlet]="groupfooter"
                    [ngTemplateOutletContext]="{ $implicit: item }"
                  />
                }
              }
            }
          }
        </tbody>
        @if (footerTpl(); as footer) {
          <tfoot class="app-table-tfoot">
            <ng-container [ngTemplateOutlet]="footer" />
          </tfoot>
        }
      </table>
    </div>
    @if (paginator()) {
      <div class="app-table-paginator">
        @if (paginatorleftTpl(); as footer) {
          <div class="app-table-paginator-left">
            <ng-container [ngTemplateOutlet]="footer" />
          </div>
        }
        @if (showCurrentPageReport()) {
          <span class="app-table-page-report">{{ pageReport() }}</span>
        }
        <div class="app-table-paginator-controls">
          <nav aria-label="Páginas de tabla">
            <ul class="pagination pagination-primary pagin-border-primary mb-0">
              <li
                class="page-item"
                [class.disabled]="currentPageIndex() === 0"
              >
                <button
                  type="button"
                  class="page-link"
                  [disabled]="currentPageIndex() === 0"
                  (click)="goToPage(currentPageIndex() - 1)"
                >
                  Previous
                </button>
              </li>
              @for (page of pageIndexes(); track page) {
                <li
                  class="page-item"
                  [class.active]="page === currentPageIndex()"
                  [attr.aria-current]="page === currentPageIndex() ? 'page' : null"
                >
                  <button
                    type="button"
                    class="page-link"
                    [disabled]="page === currentPageIndex()"
                    (click)="goToPage(page)"
                  >
                    {{ page + 1 }}
                  </button>
                </li>
              }
              <li
                class="page-item"
                [class.disabled]="currentPageIndex() >= pageCount() - 1"
              >
                <button
                  type="button"
                  class="page-link"
                  [disabled]="currentPageIndex() >= pageCount() - 1"
                  (click)="goToPage(currentPageIndex() + 1)"
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
          <select
            class="app-table-rows-select form-select form-select-sm"
            style="width: auto"
            [value]="effectiveRows()"
            (change)="changeRows(+$any($event.target).value)"
          >
            @for (opt of rowsPerPageOptions(); track opt) {
              <option [value]="opt">{{ opt }}</option>
            }
          </select>
        </div>
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        min-height: 0;
      }

      .app-table-sorticon {
        display: inline-block;
        min-width: 1em;
      }

      .app-table-sorticon-neutral {
        opacity: 0.4;
      }

      .app-table-scroll {
        overflow: auto;
      }

      .app-table-row-handle {
        cursor: grab;
      }

      .app-table-reorderable-row.app-table-row-dragover {
        box-shadow: inset 0 2px 0 var(--ds-primary, #0d6efd);
      }

      .app-table-thead th[draggable="true"] {
        cursor: grab;
      }

      .app-table-frozen-column {
        z-index: 2;
        background-color: var(--ds-surface, #fff);
      }

      .app-table-thead .app-table-frozen-column {
        z-index: 3;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppTable {
  value = input<any[]>([]);
  loading = input<boolean>(false);
  lazy = input<boolean>(false);
  paginator = input<boolean>(false);
  rows = input<number>(30);
  rowsPerPageOptions = input<number[]>([30, 50, 75, 100, 150, 200]);
  totalRecords = input<number>(0);
  showCurrentPageReport = input<boolean>(false);
  currentPageReportTemplate = input<string>(
    "Mostrando {first} a {last} de {totalRecords} registros",
  );
  globalFilterFields = input<string[]>([]);
  scrollable = input<boolean>(false);
  scrollHeight = input<string | undefined>(undefined);
  tableStyle = input<Record<string, string> | undefined>(undefined);
  size = input<"small" | undefined>(undefined);
  initialSortField = input<string | undefined>(undefined);
  initialSortOrder = input<1 | -1>(1);
  groupRowsBy = input<string | undefined>(undefined);
  dataKey = input<string | undefined>(undefined);
  selection = model<unknown[]>([]);
  reorderableRows = input<boolean>(false);
  reorderableColumns = input<boolean>(false);

  onPage = output<{ first: number; rows: number }>();
  onRowReorder = output<{ dragIndex: number; dropIndex: number }>();
  /**
   * Cambio de página, tamaño de página u orden en tablas `lazy`.
   *
   * El filtro global NO se emite desde aquí: el cambio de término lo
   * maneja cada consumidor (p. ej. `(search)` del caption), para evitar
   * una segunda carga por el mismo cambio.
   */
  onLazyLoad = output<AppTableLazyEvent>();

  sortField = linkedSignal<string | null>(
    () => this.initialSortField() ?? null,
  );
  sortOrder = linkedSignal<1 | -1>(() => this.initialSortOrder());
  private filterTerm = signal("");
  private currentPageIndex = signal(0);
  private rowsOverride = signal<number | null>(null);
  protected effectiveRows = computed(() => this.rowsOverride() ?? this.rows());
  private reorderedValue = signal<unknown[] | null>(null);
  private dragRowIndex = signal<number | null>(null);
  private columnOrder = signal<string[] | null>(null);
  private dragColKey = signal<string | null>(null);
  private hostRef = inject(ElementRef<HTMLElement>);

  constructor() {
    effect(() => {
      this.value();
      this.reorderedValue.set(null);
    });

    afterRenderEffect(() => {
      if (!this.reorderableColumns()) return;
      this.pagedValue();
      this.columnOrder();
      this.applyColumnOrder();
    });

    afterRenderEffect(() => {
      this.pagedValue();
      this.applyFrozenColumns();
    });
  }

  protected captionTpl = contentChild<TemplateRef<unknown>, TemplateRef<unknown>>("caption", {
    read: TemplateRef,
  });
  protected colgroupTpl = contentChild<TemplateRef<unknown>, TemplateRef<unknown>>("colgroup", {
    read: TemplateRef,
  });
  protected headerTpl = contentChild<TemplateRef<unknown>, TemplateRef<unknown>>("header", {
    read: TemplateRef,
  });
  protected bodyTpl = contentChild<TemplateRef<unknown>, TemplateRef<unknown>>("body", {
    read: TemplateRef,
  });
  protected emptymessageTpl = contentChild<TemplateRef<unknown>, TemplateRef<unknown>>("emptymessage", {
    read: TemplateRef,
  });
  protected paginatorleftTpl = contentChild<TemplateRef<unknown>, TemplateRef<unknown>>("paginatorleft", {
    read: TemplateRef,
  });
  protected groupheaderTpl = contentChild<TemplateRef<unknown>, TemplateRef<unknown>>("groupheader", {
    read: TemplateRef,
  });
  protected groupfooterTpl = contentChild<TemplateRef<unknown>, TemplateRef<unknown>>("groupfooter", {
    read: TemplateRef,
  });
  protected footerTpl = contentChild<TemplateRef<unknown>, TemplateRef<unknown>>("footer", {
    read: TemplateRef,
  });

  protected filteredValue = computed(() => {
    const values = this.reorderedValue() ?? this.value() ?? [];
    if (this.lazy()) return values;

    const term = this.filterTerm().trim().toLowerCase();
    if (!term) return values;

    return values.filter((item) =>
      this.globalFilterFields().some((field) =>
        String(item?.[field] ?? "").toLowerCase().includes(term),
      ),
    );
  });

  protected sortedValue = computed(() => {
    const values = this.filteredValue();
    if (this.lazy()) return values;

    const groupField = this.groupRowsBy();
    const sortField = this.sortField();
    if (!groupField && !sortField) return values;

    const order = this.sortOrder();
    return [...values].sort((left, right) => {
      if (groupField) {
        const ga = left?.[groupField];
        const gb = right?.[groupField];
        if (ga !== gb) {
          if (ga == null) return -1;
          if (gb == null) return 1;
          return (ga < gb ? -1 : 1) * order;
        }
      }
      if (!sortField) return 0;
      const a = left?.[sortField];
      const b = right?.[sortField];
      if (a === b) return 0;
      if (a == null) return -1 * order;
      if (b == null) return 1 * order;
      return (a < b ? -1 : 1) * order;
    });
  });

  public pagedValue = computed(() => {
    const values = this.sortedValue();
    if (this.lazy() || !this.paginator()) return values;

    const start = this.currentPageIndex() * this.effectiveRows();
    return values.slice(start, start + this.effectiveRows());
  });

  protected effectiveTotal = computed(() =>
    this.lazy() ? this.totalRecords() : this.filteredValue().length,
  );
  protected pageCount = computed(() =>
    Math.max(1, Math.ceil(this.effectiveTotal() / this.effectiveRows())),
  );
  protected readonly maxPageButtons = 5;
  protected pageIndexes = computed(() => {
    const count = this.pageCount();
    const max = this.maxPageButtons;
    if (count <= max) {
      return Array.from({ length: count }, (_, index) => index);
    }

    const current = this.currentPageIndex();
    let start = Math.max(0, current - Math.floor(max / 2));
    let end = start + max;
    if (end > count) {
      end = count;
      start = end - max;
    }

    return Array.from({ length: end - start }, (_, index) => start + index);
  });
  protected pageReport = computed(() => {
    const total = this.effectiveTotal();
    const first =
      total === 0 ? 0 : this.currentPageIndex() * this.effectiveRows() + 1;
    const last = Math.min(
      (this.currentPageIndex() + 1) * this.effectiveRows(),
      total,
    );
    return this.currentPageReportTemplate()
      .replace("{first}", String(first))
      .replace("{last}", String(last))
      .replace("{totalRecords}", String(total));
  });

  protected isNewGroup(item: unknown, index: number): boolean {
    const field = this.groupRowsBy();
    if (!field) return false;
    if (index === 0) return true;
    const prev = this.pagedValue()[index - 1] as Record<string, unknown>;
    return prev?.[field] !== (item as Record<string, unknown>)?.[field];
  }

  protected isEndOfGroup(item: unknown, index: number): boolean {
    const field = this.groupRowsBy();
    if (!field) return false;
    const values = this.pagedValue();
    if (index === values.length - 1) return true;
    const next = values[index + 1] as Record<string, unknown>;
    return next?.[field] !== (item as Record<string, unknown>)?.[field];
  }

  protected onColDragStart(event: DragEvent): void {
    if (!this.reorderableColumns()) return;
    const th = (event.target as HTMLElement)?.closest("th") as HTMLElement | null;
    if (!th?.dataset["appTableCol"]) return;
    this.dragColKey.set(th.dataset["appTableCol"]);
    event.dataTransfer?.setData("text/plain", th.dataset["appTableCol"]);
  }

  protected onColDragOver(event: DragEvent): void {
    if (!this.reorderableColumns() || this.dragColKey() === null) return;
    if ((event.target as HTMLElement)?.closest("th")) event.preventDefault();
  }

  protected onColDrop(event: DragEvent): void {
    if (!this.reorderableColumns()) return;
    const dragKey = this.dragColKey();
    const targetTh = (event.target as HTMLElement)?.closest("th") as HTMLElement | null;
    const dropKey = targetTh?.dataset["appTableCol"];
    this.dragColKey.set(null);
    if (!dragKey || !dropKey || dragKey === dropKey || !targetTh?.parentElement) return;

    event.preventDefault();
    const current = Array.from(targetTh.parentElement.children).map(
      (el) => (el as HTMLElement).dataset["appTableCol"] ?? "",
    );
    const from = current.indexOf(dragKey);
    const to = current.indexOf(dropKey);
    if (from === -1 || to === -1) return;
    current.splice(to, 0, current.splice(from, 1)[0]);
    this.columnOrder.set(current);
  }

  private applyColumnOrder(): void {
    const theadRow = this.hostRef.nativeElement.querySelector(".app-table-thead tr");
    if (!theadRow) return;

    const headerCells = Array.from(theadRow.children) as HTMLElement[];
    headerCells.forEach((th, i) => {
      if (!th.dataset["appTableCol"]) th.dataset["appTableCol"] = String(i);
      th.draggable = true;
    });

    const order = this.columnOrder() ?? headerCells.map((th) => th.dataset["appTableCol"]!);
    this.reorderRowChildren(theadRow as HTMLElement, order);

    const bodyRows = this.hostRef.nativeElement.querySelectorAll(".app-table-tbody tr");
    bodyRows.forEach((tr) => {
      const cells = Array.from(tr.children) as HTMLElement[];
      cells.forEach((td, i) => {
        if (!td.dataset["appTableCol"]) td.dataset["appTableCol"] = String(i);
      });
      this.reorderRowChildren(tr as HTMLElement, order);
    });
  }

  private reorderRowChildren(row: HTMLElement, order: string[]): void {
    const byKey = new Map(
      Array.from(row.children).map((el) => [(el as HTMLElement).dataset["appTableCol"], el]),
    );
    for (const key of order) {
      const el = byKey.get(key);
      if (el) row.appendChild(el);
    }
  }

  private applyFrozenColumns(): void {
    const rows = this.hostRef.nativeElement.querySelectorAll(
      ".app-table-thead tr, .app-table-tbody tr",
    ) as NodeListOf<HTMLElement>;
    rows.forEach((row) => {
      const cells = Array.from(row.children) as HTMLElement[];

      let leftOffset = 0;
      for (const cell of cells) {
        if (
          !cell.classList.contains("app-table-frozen-column") ||
          cell.dataset["frozenAlign"] === "right"
        ) {
          continue;
        }
        cell.style.position = "sticky";
        cell.style.left = `${leftOffset}px`;
        leftOffset += cell.offsetWidth;
      }

      let rightOffset = 0;
      for (let i = cells.length - 1; i >= 0; i--) {
        const cell = cells[i];
        if (
          !cell.classList.contains("app-table-frozen-column") ||
          cell.dataset["frozenAlign"] !== "right"
        ) {
          continue;
        }
        cell.style.position = "sticky";
        cell.style.right = `${rightOffset}px`;
        rightOffset += cell.offsetWidth;
      }
    });
  }

  public startRowDrag(index: number): void {
    if (!this.reorderableRows()) return;
    this.dragRowIndex.set(index);
  }

  public dropRow(dropIndex: number): void {
    if (!this.reorderableRows()) return;
    const dragIndex = this.dragRowIndex();
    if (dragIndex === null || dragIndex === dropIndex) return;

    // rowIndex context matches pagedValue(); reordering combined with an
    // active sort/pagination is not meaningful (sort would re-override the
    // drag), so this only guarantees correct behavior when neither is active.
    const values = [...this.pagedValue()];
    const [moved] = values.splice(dragIndex, 1);
    values.splice(dropIndex, 0, moved);
    this.reorderedValue.set(values);
    this.onRowReorder.emit({ dragIndex, dropIndex });
  }

  public endRowDrag(): void {
    this.dragRowIndex.set(null);
  }

  private identity(item: unknown): unknown {
    const key = this.dataKey();
    return key ? (item as Record<string, unknown>)?.[key] : item;
  }

  public isSelected(item: unknown): boolean {
    const id = this.identity(item);
    return this.selection().some((row) => this.identity(row) === id);
  }

  public toggleSelection(item: unknown): void {
    const id = this.identity(item);
    const current = this.selection();
    this.selection.set(
      this.isSelected(item)
        ? current.filter((row) => this.identity(row) !== id)
        : [...current, item],
    );
  }

  public toggleAllSelection(): void {
    const rows = this.pagedValue();
    const allSelected = rows.length > 0 && rows.every((row) => this.isSelected(row));
    if (allSelected) {
      const rowIds = new Set(rows.map((row) => this.identity(row)));
      this.selection.set(this.selection().filter((row) => !rowIds.has(this.identity(row))));
    } else {
      const current = this.selection();
      const currentIds = new Set(current.map((row) => this.identity(row)));
      this.selection.set([
        ...current,
        ...rows.filter((row) => !currentIds.has(this.identity(row))),
      ]);
    }
  }

  public sort(field: string): void {
    if (field === this.sortField()) {
      this.sortOrder.set(this.sortOrder() === 1 ? -1 : 1);
    } else {
      this.sortField.set(field);
      this.sortOrder.set(1);
    }
    this.emitLazy(
      this.currentPageIndex() * this.effectiveRows(),
      this.effectiveRows(),
    );
  }

  /**
   * Notifica a los consumidores server-side. Solo emite en modo `lazy`;
   * nunca durante cambios de inputs, para no provocar cargas en bucle.
   */
  private emitLazy(first: number, rows: number): void {
    if (!this.lazy()) return;
    this.onLazyLoad.emit({
      first,
      rows,
      globalFilter: this.filterTerm(),
      sortField: this.sortField(),
      sortOrder: this.sortOrder(),
    });
  }

  public filterGlobal(term: string, _mode: string): void {
    this.filterTerm.set(term);
    this.currentPageIndex.set(0);
  }

  public changeRows(newRows: number): void {
    this.rowsOverride.set(newRows);
    this.currentPageIndex.set(0);
    this.onPage.emit({ first: 0, rows: newRows });
    this.emitLazy(0, newRows);
  }

  public goToPage(index: number): void {
    const page = Math.max(0, Math.min(index, this.pageCount() - 1));
    this.currentPageIndex.set(page);
    this.onPage.emit({
      first: page * this.effectiveRows(),
      rows: this.effectiveRows(),
    });
    this.emitLazy(page * this.effectiveRows(), this.effectiveRows());
  }
}
