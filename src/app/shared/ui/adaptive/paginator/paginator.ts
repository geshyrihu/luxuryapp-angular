import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { MobilePaginator } from "@ui/mobile/paginator/paginator";
import { PaginatorBase } from "@ui/base/paginator.base";

@Component({
  selector: "lx-paginator",
  standalone: true,
  imports: [MobilePaginator],
  template: `
    @if (platform.isMobile()) {
      <ili-paginator
        [(page)]="page"
        [(rows)]="rows"
        [totalRecords]="totalRecords()"
        [rowsPerPageOptions]="rowsPerPageOptions()"
        [showFirstLast]="showFirstLast()"
        [showJumpToPage]="showJumpToPage()"
        [showPageLinks]="showPageLinks()"
        (pageChange)="pageChange.emit($event)"
      />
    } @else {
      <!-- Web uses PrimeNG p-paginator integrated in p-table -->
      <p class="lx-paginator-web-fallback" style="color: var(--ds-text-secondary); font-size: 0.8125rem; padding: 0.5rem; text-align: center;">
        Usa PrimeNG p-paginator integrado en p-table.
      </p>
    }
  `,
})
export class LxPaginator extends PaginatorBase {
  protected platform = inject(PlatformService);
}
