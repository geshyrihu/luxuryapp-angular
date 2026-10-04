import { Component, inject } from "@angular/core";
import { TableBase } from "@ui/core/table.base";
import { MobileTable } from "@ui/mobile/table/table";
import { PlatformService } from "@core/services/platform.service";

@Component({
  selector: "lux-table",

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
      <!-- Web uses Bootstrap p-table directly in feature components -->
      <p
        class="lx-table-web-fallback"
        style="color: var(--ds-text-secondary); font-size: 0.875rem; padding: 1rem;"
      >
        Usa &lt;p-table&gt; de Bootstrap directamente en web.
      </p>
    }
  `,
})
export class LxTable extends TableBase {
  protected platform = inject(PlatformService);
}

