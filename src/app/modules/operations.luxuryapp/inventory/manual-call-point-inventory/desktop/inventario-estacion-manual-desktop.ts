import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { InventarioEstacionManualDto } from "@core/interfaces/inventario-estacion-manual.interface";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconDownload } from "@ui/buttons/web-icon/button-download";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { ButtonWeb } from "@ui/buttons/web";
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
  selector: "app-inventario-estacion-manual-desktop",
  templateUrl: "./inventario-estacion-manual-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    WebButtonIconItem,
    WebButtonIconDownload,
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
export class InventarioEstacionManualDesktop {
  tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<InventarioEstacionManualDto[]>();
  globalFilterFields = input<string[]>([]);

  add = output<void>();
  edit = output<InventarioEstacionManualDto>();
  delete = output<string>();
  viewHistory = output<InventarioEstacionManualDto>();
  downloadQr = output<InventarioEstacionManualDto>();
  downloadAllQr = output<void>();
  downloadPdf = output<void>();
  openScanner = output<void>();
  deleteAll = output<void>();
  downloadTemplate = output<void>();
  importExcel = output<Event>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;
}
