import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import {
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { ButtonWeb } from "@ui/buttons/web";
import { LxIcon } from "@ui/adaptive/icon/icon";


import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { AppSortableColumn, AppTable } from "src/app/shared/ui/web/lux-table/lux-table";
import { TaskStatus } from "../../task-status/task-status";

@Component({
  selector: "app-my-requests-task-desktop",
  templateUrl: "./my-requests-task-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    AppTable,
    AppSortableColumn,
    LuxTableCaption,
    TaskStatus,
    LxIcon],
})
export class MyRequestsTaskDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  statusChange = output<string>();
  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string; ticketGroupId?: string }>();
  followUp = output<string>();
  updatePriority = output<string>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();

  private tableScrollHeightS = inject(TableScrollHeightService);
  scrollHeight = this.tableScrollHeightS.scrollHeight;
}
