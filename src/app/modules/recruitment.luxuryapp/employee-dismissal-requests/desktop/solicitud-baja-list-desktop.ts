import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  ViewChild,
} from "@angular/core";
import { FilterRequestsService } from "@core/http/services/filter-requests.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import {
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { LxTag } from "@ui/adaptive/tag/tag";
import { ButtonWeb } from "@ui/buttons/web";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
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
import type { SolicitudBajaListItem } from "../solicitud-baja-list";

@Component({
  selector: "app-solicitud-baja-list-desktop",
  templateUrl: "./solicitud-baja-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    WebButtonIconDelete,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    TableFooter,
    LxTag,
  ],
})
export class SolicitudBajaListDesktop {
  private readonly filterRequestsService = inject(FilterRequestsService);
  private readonly tableScrollHeightS = inject(TableScrollHeightService);

  readonly requestStatusBorderColor = requestStatusBorderColor;
  readonly requestStatusTagSeverity = requestStatusTagSeverity;

  data = input.required<SolicitudBajaListItem[]>();
  globalFilterFields = input<string[]>([]);

  edit = output<SolicitudBajaListItem>();
  delete = output<string>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  @ViewChild("dt") dt?: AppTable;
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  constructor() {
    effect(() => {
      const term = this.filterRequestsService.searchTerm();
      this.dt?.filterGlobal(term, "contains");
    });
  }
}
