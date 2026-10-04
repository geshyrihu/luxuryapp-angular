import { Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { PaginatorBase } from "@ui/core/paginator.base";
import { MobilePaginator } from "@ui/mobile/paginator/paginator";

@Component({
  selector: "lux-paginator",

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
      <!-- Web uses Bootstrap p-paginator integrated in p-table -->
      <p
        class="lux-paginator-web-fallback"
        style="color: var(--ds-text-secondary); font-size: 0.8125rem; padding: 0.5rem; text-align: center;"
      >
        Usa Bootstrap p-paginator integrado en p-table.
      </p>
    }
  `,
})
export class LxPaginator extends PaginatorBase {
  protected platform = inject(PlatformService);
}
