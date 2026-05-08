import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnInit, inject, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { DatePickerModule } from "primeng/datepicker";
import { TableModule } from "primeng/table";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { StatusBadge } from "src/app/core/components/status-badge/status-badge";
import { TaskInstance } from "src/app/core/models/recurring-tasks/task-instance.model";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { CompleteTaskForm } from "../complete-task-form/complete-task-form";
@Component({
  selector: "app-daily-task-list",
  templateUrl: "./daily-task-list.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePickerModule,
    CustomButton,
    TableModule,
    StatusBadge,
  ],
  providers: [DatePipe],
})
export class DailyTaskList implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  public dialogHandlerS = inject(DialogHandlerService);
  private datePipe = inject(DatePipe);
  private tableScrollHeightS = inject(TableScrollHeightService);
  tasks = signal<TaskInstance[]>([]);
  selectedDateControl = new FormControl<Date>(new Date());
  loading = signal<boolean>(false);
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  ngOnInit(): void {
    this.loadTasks();
  }

  async loadTasks() {
    this.loading.set(true);
    const dateString = this.datePipe.transform(
      this.selectedDateControl.value,
      "yyyy-MM-dd",
    );
    const url = `recurring-tasks/instances/my-daily-tasks?date=${dateString}`;

    const response = await this.apiResponseS.onGetList<TaskInstance[]>(url);
    this.tasks.set(response || []);
    this.loading.set(false);
  }

  onDateChange() {
    this.loadTasks();
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
