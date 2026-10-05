import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { LxConfirmDialog } from "@ui/adaptive/confirm-dialog/confirm-dialog";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { ApiDatePipe } from "src/app/shared/pipes/api-date.pipe";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { VacationBalanceAdminViewDto } from "../../../interfaces/vacation-balance-admin-view.interface";

@Component({
  selector: "app-admin-vacaciones-balance-desktop",
  templateUrl: "./admin-vacaciones-balance-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LxConfirmDialog,
    ApiDatePipe,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    WebButtonLabel,
    LxTag,
    LuxTableCaption,
    WebButtonIconEdit,
    TableEmptyMessage,
  ],
})
export class AdminVacacionesBalanceDesktop {
  tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<VacationBalanceAdminViewDto[]>();
  loading = input<boolean>(false);
  globalFilterFields = input<string[]>([]);

  recalculate = output<void>();
  edit = output<VacationBalanceAdminViewDto>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  getSeverity(isDiscrepant: boolean): string {
    return isDiscrepant ? "danger" : "success";
  }
}
