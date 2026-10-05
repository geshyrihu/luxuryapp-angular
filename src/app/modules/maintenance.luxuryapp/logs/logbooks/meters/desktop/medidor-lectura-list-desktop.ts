import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { WebButtonIconDownload } from "@ui/buttons/web-icon/button-download";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-medidor-lectura-list-desktop",
  templateUrl: "./medidor-lectura-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ActionMenu,
    WebButtonIconDownload,
    WebButtonLabelDelete,
    WebButtonLabelEdit,
    ApiDatePipe,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LuxTableCaption,
    TableEmptyMessage,
    TableFooter,
  ],
})
export class MedidorLecturaListDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<any>();
  exportExcel = output<void>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
}
