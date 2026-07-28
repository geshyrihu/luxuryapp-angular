import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { PaginatorBase } from "@ui/base/paginator.base";
import { PaginatorModule } from "primeng/paginator";

@Component({
  selector: "app-paginator",

  imports: [PaginatorModule],
  template: `
    <p-paginator
      [first]="page() * rows()"
      [rows]="rows()"
      [totalRecords]="totalRecords()"
      [rowsPerPageOptions]="rowsPerPageOptions()"
      [showFirstLastIcon]="showFirstLast()"
      [showJumpToPageDropdown]="showJumpToPage()"
      [showPageLinks]="showPageLinks()"
      (onPageChange)="onPrimePageChange($event)"
    />
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppPaginator extends PaginatorBase {
  onPrimePageChange(event: any): void {
    const newPage = Math.floor(event.first / event.rows);
    this.page.set(newPage);
    if (event.rows !== this.rows()) {
      this.rows.set(event.rows);
    }
    this.paginationChange.emit({
      page: newPage,
      rows: event.rows,
      totalRecords: event.totalRecords,
    });
  }
}
