import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { InventarioLlave } from "@core/interfaces/inventario-llave.interface";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-inventario-llaves-list-desktop",
  templateUrl: "./inventario-llaves-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    LxTooltipDirective,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LuxTableCaption,
    TableFooter,
  ],
})
export class InventarioLlavesListDesktop {
  tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<InventarioLlave[]>();
  globalFilterFields = input<string[]>([]);

  add = output<void>();
  edit = output<InventarioLlave>();
  delete = output<string>();
  downloadPdf = output<void>();

  scrollHeight = this.tableScrollHeightS.scrollHeight;
}
