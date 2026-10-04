import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { InventarioExtintorDto } from "@core/interfaces/inventario-extintor.interface";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconDownload } from "@ui/buttons/web-icon/button-download";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { AppImage } from "@ui/web/image/image";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-inventario-extintor-desktop",
  templateUrl: "./inventario-extintor-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WebButtonIcon,
    WebButtonIconDownload,
    WebButtonIconItem,
    WebButtonIconEdit,
    WebButtonIconDelete,
    LxTooltipDirective,
    TableEmptyMessage,
    AppImage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LuxTableCaption,
    TableFooter,
  ],
})
export class InventarioExtintorDesktop {
  tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<InventarioExtintorDto[]>();
  globalFilterFields = input<string[]>([]);

  add = output<void>();
  edit = output<InventarioExtintorDto>();
  delete = output<string>();
  viewHistory = output<InventarioExtintorDto>();
  downloadPdf = output<void>();
  downloadAllQr = output<void>();
  openScanner = output<void>();
  bulkExpiration = output<void>();
  downloadQr = output<InventarioExtintorDto>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;
}
