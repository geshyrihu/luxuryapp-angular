import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { TaskInstance } from "@core/interfaces/recurring-tasks/task-instance.interface";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { ButtonWeb } from "@ui/buttons/web";
import { StatusBadge } from "@ui/web/status-badge/status-badge";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-task-instance-list-desktop",
  templateUrl: "./task-instance-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    ApiDatePipe,
    StatusBadge,
    AppTable,
    LuxTableCaption,
    TableEmptyMessage,
    TableFooter],
})
export class TaskInstanceListDesktop {
  data = input.required<TaskInstance[]>();
  loading = input<boolean>(false);

  complete = output<TaskInstance>();
  reopen = output<string>();

  private tableScrollHeightS = inject(TableScrollHeightService);
  scrollHeight = this.tableScrollHeightS.scrollHeight;
}
