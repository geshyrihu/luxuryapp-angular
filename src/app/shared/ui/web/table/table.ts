import { NgStyle, NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  Directive,
  inject,
  input,
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
        <thead class="app-table-thead">
          <ng-container [ngTemplateOutlet]="headerTpl() ?? null" />
        </thead>
        <tbody class="app-table-tbody">
          @if (pagedValue().length === 0) {
            <ng-container [ngTemplateOutlet]="emptymessageTpl() ?? null" />
          } @else {
            @for (item of pagedValue(); track $index) {
              <ng-container
                [ngTemplateOutlet]="bodyTpl() ?? null"
                [ngTemplateOutletContext]="{ $implicit: item }"
              />
            }
          }
        </tbody>
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
          <button
            type="button"
            class="app-table-paginator-element"
            [disabled]="currentPageIndex() === 0"
            (click)="goToPage(0)"
          >
            «
          </button>
          <button
            type="button"
            class="app-table-paginator-element"
            [disabled]="currentPageIndex() === 0"
            (click)="goToPage(currentPageIndex() - 1)"
          >
            ‹
          </button>
          @for (page of pageIndexes(); track page) {
            <button
              type="button"
              class="app-table-paginator-element"
              [class.is-active]="page === currentPageIndex()"
              (click)="goToPage(page)"
            >
              {{ page + 1 }}
            </button>
          }
          <button
            type="button"
            class="app-table-paginator-element"
            [disabled]="currentPageIndex() >= pageCount() - 1"
            (click)="goToPage(currentPageIndex() + 1)"
          >
            ›
          </button>
          <button
            type="button"
            class="app-table-paginator-element"
            [disabled]="currentPageIndex() >= pageCount() - 1"
            (click)="goToPage(pageCount() - 1)"
          >
            »
          </button>
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

      .app-table-scroll {
        overflow: auto;
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

  onPage = output<{ first: number; rows: number }>();

  sortField = signal<string | null>(null);
  sortOrder = signal<1 | -1>(1);
  private filterTerm = signal("");
  private currentPageIndex = signal(0);
  private rowsOverride = signal<number | null>(null);
  protected effectiveRows = computed(() => this.rowsOverride() ?? this.rows());

  protected captionTpl = contentChild<TemplateRef<unknown>, TemplateRef<unknown>>("caption", {
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

  protected filteredValue = computed(() => {
    const values = this.value();
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
    if (this.lazy() || !this.sortField()) return values;

    const field = this.sortField()!;
    const order = this.sortOrder();
    return [...values].sort((left, right) => {
      const a = left?.[field];
      const b = right?.[field];
      if (a === b) return 0;
      if (a == null) return -1 * order;
      if (b == null) return 1 * order;
      return (a < b ? -1 : 1) * order;
    });
  });

  protected pagedValue = computed(() => {
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
  protected pageIndexes = computed(() =>
    Array.from({ length: this.pageCount() }, (_, index) => index),
  );
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

  public sort(field: string): void {
    if (field === this.sortField()) {
      this.sortOrder.set(this.sortOrder() === 1 ? -1 : 1);
    } else {
      this.sortField.set(field);
      this.sortOrder.set(1);
    }
  }

  public filterGlobal(term: string, _mode: string): void {
    this.filterTerm.set(term);
    this.currentPageIndex.set(0);
  }

  public changeRows(newRows: number): void {
    this.rowsOverride.set(newRows);
    this.currentPageIndex.set(0);
    this.onPage.emit({ first: 0, rows: newRows });
  }

  public goToPage(index: number): void {
    const page = Math.max(0, Math.min(index, this.pageCount() - 1));
    this.currentPageIndex.set(page);
    this.onPage.emit({
      first: page * this.effectiveRows(),
      rows: this.effectiveRows(),
    });
  }
}
