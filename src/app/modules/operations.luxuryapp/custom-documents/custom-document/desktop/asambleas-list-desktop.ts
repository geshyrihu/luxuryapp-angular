import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
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
  selector: "app-asambleas-list-desktop",
  templateUrl: "./asambleas-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WebButtonIconViewPdf,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    AppReorderableRow,
    AppReorderableRowHandle,
    LuxTableCaption,
    TableFooter,
    AppIcon,
  ],
})
export class AsambleasListDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  rowReorder = output<{ dragIndex: number; dropIndex: number }>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
}
