import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  ViewChild,
} from "@angular/core";
import {
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { LxTag } from "@ui/adaptive/tag/tag";
import { ButtonWeb } from "@ui/buttons/web";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import {
  requestStatusBorderColor,
  requestStatusTagSeverity,
} from "../../recruitment-shared/request-status-style";

@Component({
  selector: "app-solicitud-modificacion-list-desktop",
  templateUrl: "./solicitud-modificacion-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    TableFooter,
    LxTag,
  ],
})
export class SolicitudModificacionListDesktop {
  private readonly tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  searchTerm = input<string>("");

  edit = output<{ id: string; title: string }>();
  delete = output<string>();

  readonly requestStatusBorderColor = requestStatusBorderColor;
  readonly requestStatusTagSeverity = requestStatusTagSeverity;

  tableRows: number = tableRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  @ViewChild("dt") dt?: AppTable;

  constructor() {
    effect(() => {
      const term = this.searchTerm();
      this.dt?.filterGlobal(term, "contains");
    });
  }
}
