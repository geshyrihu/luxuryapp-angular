import { Directive, input, model, output } from "@angular/core";
import type { AppIconName } from "@ui/shared/app-icon/app-icon.catalog";

export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  minWidth?: string;
  styleClass?: string;
  icon?: AppIconName;
  template?: string;
}

export interface TableSortEvent {
  field: string;
  order: 1 | -1;
}

export interface TablePageEvent {
  page: number;
  rows: number;
  totalRecords: number;
}

@Directive()
export abstract class TableBase {
  columns = input.required<TableColumn[]>();
  data = input.required<any[]>();
  loading = input<boolean>(false);
  dataKey = input<string>("id");
  selectionMode = input<"single" | "multiple" | undefined>(undefined);
  selection = model<any>(undefined);
  paginator = input<boolean>(false);
  rows = input<number>(20);
  rowsPerPageOptions = input<number[]>([10, 20, 50, 100]);
  totalRecords = input<number>(0);
  sortField = input<string>("");
  sortOrder = input<number>(1);
  globalFilterFields = input<string[]>([]);
  emptyMessage = input<string>("Sin datos");
  scrollable = input<boolean>(false);
  scrollHeight = input<string>("400px");

  pageChange = output<TablePageEvent>();
  sortChange = output<TableSortEvent>();
  rowClick = output<any>();
}
