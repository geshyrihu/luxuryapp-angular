import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { ButtonWeb } from "@ui/buttons/web";

@Component({
  selector: "app-historial-compras-list-desktop",
  templateUrl: "./historial-compras-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    CommonModule,
    ApiDatePipe,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LuxTableCaption,
    TableFooter,
  ],
})
export class HistorialComprasListDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  loading = input<boolean>(false);

  viewOrder = output<string>();

  readonly tableRows = tableRows();
  readonly rowsPerPageOptions = rowsPerPageOptions();
}
