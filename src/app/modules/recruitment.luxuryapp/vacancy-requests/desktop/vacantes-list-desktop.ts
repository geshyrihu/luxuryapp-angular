import { CommonModule } from "@angular/common";
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
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
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
  selector: "app-vacantes-list-desktop",
  templateUrl: "./vacantes-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    WebButtonIconEdit,
    WebButtonIconItem,
    WebButtonIconDelete,
    LxTooltipDirective,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    TableFooter,
    LxTag,
  ],
})
export class VacantesListDesktop {
  private readonly tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  searchTerm = input<string>("");
  isSuperUser = input<boolean>(false);
  canManageCandidates = input<boolean>(false);

  edit = output<{ id: string }>();
  delete = output<string>();
  deletePermanente = output<string>();
  detail = output<string>();
  jobDescription = output<string>();
  candidates = output<{ workPositionId: string; requestPositionId: string }>();

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
