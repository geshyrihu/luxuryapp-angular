import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";

import { ButtonWeb } from "@ui/buttons/web";

import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { AppSortableColumn, AppTable } from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-warehouse-stock-list-desktop",
  templateUrl: "./warehouse-stock-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    LuxTableCaption,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn],
})
export class WarehouseStockListDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  rowGroupMetadata = input<any>({});
  canAdd = input<boolean>(false);
  canManage = input<boolean>(false);

  add = output<void>();
  edit = output<any>();
  addEntrada = output<any>();
  addSalida = output<any>();
  delete = output<string>();
  sort = output<void>();
  tarjetaProducto = output<any>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
}
