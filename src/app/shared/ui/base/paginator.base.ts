import { Directive, input, model, output } from "@angular/core";

export interface PageEvent {
  page: number;
  rows: number;
  totalRecords: number;
}

@Directive()
export abstract class PaginatorBase {
  page = model<number>(0);
  rows = model<number>(20);
  totalRecords = input<number>(0);
  rowsPerPageOptions = input<number[]>([10, 20, 50, 100]);
  showFirstLast = input<boolean>(true);
  showJumpToPage = input<boolean>(false);
  showPageLinks = input<boolean>(true);

  pageChange = output<PageEvent>();

  totalPages(): number {
    const t = this.totalRecords();
    const r = this.rows();
    return t > 0 && r > 0 ? Math.ceil(t / r) : 0;
  }

  isFirstPage(): boolean {
    return this.page() <= 0;
  }

  isLastPage(): boolean {
    return this.page() >= this.totalPages() - 1;
  }

  firstItem(): number {
    return Math.min(this.totalRecords(), this.page() * this.rows() + 1);
  }

  lastItem(): number {
    return Math.min(this.totalRecords(), (this.page() + 1) * this.rows());
  }

  onPageChange(newPage: number): void {
    const total = this.totalPages();
    if (newPage < 0 || newPage >= total) return;
    this.page.set(newPage);
    this.pageChange.emit({ page: newPage, rows: this.rows(), totalRecords: this.totalRecords() });
  }

  onRowsChange(newRows: number): void {
    this.rows.set(newRows);
    this.page.set(0);
    this.pageChange.emit({ page: 0, rows: newRows, totalRecords: this.totalRecords() });
  }
}
