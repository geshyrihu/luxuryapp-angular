import { TitleCasePipe } from "@angular/common";
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
import { ButtonWeb } from "@ui/buttons/web";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
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
  selector: "app-seguimiento-minutas-desktop",
  templateUrl: "./seguimiento-minutas-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TitleCasePipe,
    SanitizeHtmlPipe,
    LxTag,
    WebButtonLabel,
    ButtonWeb,
    ActionMenu,
    LuxTableCaption,
    TableEmptyMessage,
    TableFooter,
    AppTable,
    AppSortableColumn,
    AppSorticon,
  ],
})
export class SeguimientoMinutasDesktop {
  tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  statusFiltro = input<number>(0);

  filtrar = output<number>();
  todosSeguimientos = output<number>();
  addSeguimiento = output<number>();
  edit = output<any>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;
}
