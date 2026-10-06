import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { PdfViewerTrigger } from "@ui/web/pdf-viewer-trigger/pdf-viewer-trigger";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import { AppReorderableRow, AppReorderableRowHandle, AppSortableColumn, AppTable } from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-asambleas-list-desktop",
  templateUrl: "./asambleas-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PdfViewerTrigger,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppReorderableRow,
    AppReorderableRowHandle,
    LuxTableCaption,
    TableFooter,
    LxIcon],
})
export class AsambleasListDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  rowReorder = output<{ dragIndex: number; dropIndex: number }>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
}
