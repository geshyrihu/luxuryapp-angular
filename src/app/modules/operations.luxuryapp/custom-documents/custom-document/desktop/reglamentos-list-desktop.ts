import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
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
  selector: "app-reglamentos-list-desktop",
  templateUrl: "./reglamentos-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WebButtonIcon,
    LxTooltipDirective,
    WebButtonIconViewPdf,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    AppReorderableRow,
    AppReorderableRowHandle,
    NgbTooltipModule,
    LuxTableCaption,
    TableFooter,
    AppIcon,
  ],
})
export class ReglamentosListDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  consult = output<string>();
  rowReorder = output<{ dragIndex: number; dropIndex: number }>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
}
