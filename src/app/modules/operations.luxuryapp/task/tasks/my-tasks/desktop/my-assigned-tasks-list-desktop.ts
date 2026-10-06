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
import { InitialsAbbrPipe } from "@shared/pipes/initials-abbr.pipe";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { ButtonWeb } from "@ui/buttons/web";
import { LxIcon } from "@ui/adaptive/icon/icon";



import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";
import { TaskStatus } from "../../task-status/task-status";

@Component({
  selector: "app-my-assigned-tasks-list-desktop",
  templateUrl: "./my-assigned-tasks-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    TableEmptyMessage,
    TaskStatus,
    AppTable,
    LxTooltipDirective,
    LuxTableCaption,
    InitialsAbbrPipe,
    LxIcon],
})
export class MyAssignedTasksListDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  statusChange = output<string>();
  add = output<{ id: string; title: string }>();
  print = output<void>();
  cardEmployee = output<string>();
  followUp = output<string>();
  program = output<string>();
  closed = output<string>();
  reopen = output<string>();
  edit = output<{ id: string; title: string; ticketGroupId?: string }>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();

  private tableScrollHeightS = inject(TableScrollHeightService);
  scrollHeight = this.tableScrollHeightS.scrollHeight;
}
