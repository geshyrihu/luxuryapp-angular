import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { InventarioHidranteDto } from "@core/interfaces/inventario-hidrante.interface";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
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
  selector: "app-inventario-hidrante-desktop",
  templateUrl: "./inventario-hidrante-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
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
export class InventarioHidranteDesktop {
  tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<InventarioHidranteDto[]>();
  globalFilterFields = input<string[]>([]);

  add = output<void>();
  edit = output<InventarioHidranteDto>();
  delete = output<string>();
  viewHistory = output<InventarioHidranteDto>();
  downloadQr = output<InventarioHidranteDto>();
  downloadAllQr = output<void>();
  openScanner = output<void>();
  downloadTemplate = output<void>();
  importExcel = output<Event>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;
}
