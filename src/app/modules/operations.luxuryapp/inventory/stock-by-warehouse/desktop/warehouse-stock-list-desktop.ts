import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { AppAvatar } from "@ui/web/avatar/avatar";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-warehouse-stock-list-desktop",
  templateUrl: "./warehouse-stock-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppAvatar,
    LuxTableCaption,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LxTooltipDirective,
    WebButtonIconDelete,
    WebButtonIconEdit,
    WebButtonIconItem,
  ],
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
