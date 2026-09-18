import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed } from "@angular/core";
import { PaginatorBase } from "@ui/base/paginator.base";

@Component({
  selector: "app-paginator",
  template: `
    <nav class="app-paginator" aria-label="Paginación">
      <ul class="pagination pagination-sm mb-0 flex-wrap align-items-center gap-2">
        @if (showFirstLast()) {
          <li class="page-item" [class.disabled]="isFirstPage()"><button type="button" class="page-link" (click)="onPageChange(0)" aria-label="Primera página">«</button></li>
        }
        <li class="page-item" [class.disabled]="isFirstPage()"><button type="button" class="page-link" (click)="onPageChange(page() - 1)" aria-label="Página anterior">‹</button></li>
        @if (showPageLinks()) {
          @for (p of pageIndexes(); track p) {
            <li class="page-item" [class.active]="p === page()"><button type="button" class="page-link" [attr.aria-current]="p === page() ? 'page' : null" (click)="onPageChange(p)">{{ p + 1 }}</button></li>
          }
        }
        <li class="page-item" [class.disabled]="isLastPage()"><button type="button" class="page-link" (click)="onPageChange(page() + 1)" aria-label="Página siguiente">›</button></li>
        @if (showFirstLast()) {
          <li class="page-item" [class.disabled]="isLastPage()"><button type="button" class="page-link" (click)="onPageChange(totalPages() - 1)" aria-label="Última página">»</button></li>
        }
        @if (showJumpToPage() && totalPages() > 1) {
          <li class="ms-2"><select class="form-select form-select-sm" style="width: auto" aria-label="Ir a página" [value]="page()" (change)="onPageChange(+$any($event.target).value)">@for (p of allPageIndexes(); track p) { <option [value]="p">Página {{ p + 1 }}</option> }</select></li>
        }
        <li class="ms-2"><select class="form-select form-select-sm" style="width: auto" aria-label="Filas por página" [value]="rows()" (change)="onRowsChange(+$any($event.target).value)">@for (opt of rowsPerPageOptions(); track opt) { <option [value]="opt">{{ opt }} / página</option> }</select></li>
      </ul>
    </nav>
  `,
  styles: [`:host { display: block; }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppPaginator extends PaginatorBase {
  protected readonly maxPageButtons = 5;
  protected pageIndexes = computed(() => {
    const count = this.totalPages();
    if (count <= this.maxPageButtons) return Array.from({ length: count }, (_, index) => index);
    const half = Math.floor(this.maxPageButtons / 2);
    const start = Math.min(Math.max(0, this.page() - half), count - this.maxPageButtons);
    return Array.from({ length: this.maxPageButtons }, (_, index) => start + index);
  });
  protected allPageIndexes = computed(() => Array.from({ length: this.totalPages() }, (_, index) => index));
}
