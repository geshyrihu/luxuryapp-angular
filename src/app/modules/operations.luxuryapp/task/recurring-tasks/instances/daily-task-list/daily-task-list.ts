import { ButtonWeb } from "@ui/buttons/web";
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { TaskInstance } from "@core/interfaces/recurring-tasks/task-instance.interface";
import { DateService } from "@core/services/date.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";

import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";
import { ApiDatePipe } from "../../../../../../shared/pipes/api-date.pipe";
import { CompleteTaskForm } from "../complete-task-form/complete-task-form";
@Component({
  selector: "app-daily-task-list",
  templateUrl: "./daily-task-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ButtonWeb,
    ApiDatePipe,
    ReactiveFormsModule,
    CustomInputDateSignal,
    AppTable],
})
export class DailyTaskList implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  public dialogHandlerS = inject(DialogHandlerService);
  private dateS = inject(DateService);
  private tableScrollHeightS = inject(TableScrollHeightService);
  tasks = signal<TaskInstance[]>([]);
  selectedDateControl = new FormControl<string>(this.dateS.getDateNow());
  loading = signal<boolean>(false);
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  ngOnInit(): void {
    this.selectedDateControl.valueChanges.subscribe(() => this.loadTasks());
    this.loadTasks();
  }

  async loadTasks() {
    this.loading.set(true);
    const url = `recurring-tasks/instances/my-daily-tasks?date=${this.selectedDateControl.value}`;
    const response = await this.apiResponseS.onGetList<TaskInstance[]>(url);
    this.tasks.set(response || []);
    this.loading.set(false);
  }

  showCompleteDialog(task: TaskInstance) {
    this.dialogHandlerS
      .openDialog(
        CompleteTaskForm,
        { task },
        `Completar Tarea: ${task.title}`,
        this.dialogHandlerS.sizeMd,
      )
      .then((result: boolean) => {
        if (result) this.loadTasks();
      });
  }
}
