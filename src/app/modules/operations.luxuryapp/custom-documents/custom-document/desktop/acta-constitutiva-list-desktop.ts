import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { PdfViewerTrigger } from "@ui/web/pdf-viewer-trigger/pdf-viewer-trigger";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-acta-constitutiva-list-desktop",
  templateUrl: "./acta-constitutiva-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PdfViewerTrigger,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LuxTableCaption,
    TableFooter,
  ],
})
export class ActaConstitutivaListDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
}
