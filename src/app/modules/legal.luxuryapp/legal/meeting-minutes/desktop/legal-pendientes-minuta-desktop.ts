import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { SanitizeHtmlPipe } from "@shared/pipes/sanitize-html.pipe";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabelAdd } from "@ui/buttons/web-label/button-add";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { WebButtonLabelItem } from "@ui/buttons/web-label";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-legal-pendientes-minuta-desktop",
  templateUrl: "./legal-pendientes-minuta-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TableEmptyMessage,
    WebButtonLabelEdit,
    WebButtonLabelAdd,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LxTag,
    LuxTableCaption,
    TableFooter,
    ActionMenu,
    SanitizeHtmlPipe,
    WebButtonLabelItem,
  ],
})
export class LegalPendientesMinutaDesktop {
  tableScrollHeightS = inject(TableScrollHeightService);
  scrollHeight = this.tableScrollHeightS.scrollHeight;
  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();

  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  addTracking = output<number>();
  viewAll = output<number>();
  editMinuta = output<number>();
}
