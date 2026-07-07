import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { MobileTable } from "@ui/mobile/table/table";
import { TableBase } from "@ui/base/table.base";

@Component({
  selector: "lx-table",
  standalone: true,
  imports: [MobileTable],
  template: `
    @if (platform.isMobile()) {
      <ili-table
        [columns]="columns()"
        [data]="data()"
        [loading]="loading()"
        [dataKey]="dataKey()"
        [selectionMode]="selectionMode()"
        [(selection)]="selection"
        [paginator]="paginator()"
        [rows]="rows()"
        [rowsPerPageOptions]="rowsPerPageOptions()"
        [totalRecords]="totalRecords()"
        [sortField]="sortField()"
        [sortOrder]="sortOrder()"
        [globalFilterFields]="globalFilterFields()"
        [emptyMessage]="emptyMessage()"
        [scrollable]="scrollable()"
        [scrollHeight]="scrollHeight()"
        (pageChange)="pageChange.emit($event)"
        (sortChange)="sortChange.emit($event)"
        (rowClick)="rowClick.emit($event)"
        (selectionChange)="selectionChange.emit($event)"
      />
    } @else {
      <!-- Web uses PrimeNG p-table directly in feature components -->
      <p class="lx-table-web-fallback" style="color: var(--ds-text-secondary); font-size: 0.875rem; padding: 1rem;">
        Usa &lt;p-table&gt; de PrimeNG directamente en web.
      </p>
    }
  `,
})
export class LxTable extends TableBase {
  protected platform = inject(PlatformService);
}
