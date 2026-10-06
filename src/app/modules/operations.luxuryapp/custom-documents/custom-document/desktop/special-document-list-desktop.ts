import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppReorderableRow,
  AppReorderableRowHandle,
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-special-document-list-desktop",
  templateUrl: "./special-document-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    AppReorderableRow,
    AppReorderableRowHandle,
    LuxTableCaption,
    TableFooter,
    LxIcon,
  ],
})
export class SpecialDocumentListDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  title = input<string>("");

  add = output<{ id: string; title: string }>();
  rowReorder = output<{ dragIndex: number; dropIndex: number }>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
}
