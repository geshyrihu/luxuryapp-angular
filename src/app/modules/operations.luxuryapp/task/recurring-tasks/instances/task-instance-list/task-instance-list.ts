import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { TaskInstance } from "@core/interfaces/recurring-tasks/task-instance.interface";
import { DateService } from "@core/services/date.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { LxToolbar } from "@ui/adaptive/toolbar/toolbar";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CompleteTaskForm } from "../complete-task-form/complete-task-form";
import { TaskInstanceListDesktop } from "./desktop/task-instance-list-desktop";
import { TaskInstanceListMobile } from "./mobile/task-instance-list-mobile";

@Component({
  selector: "app-task-instance-list",
  templateUrl: "./task-instance-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    LxToolbar,
    CustomInputDateSignal,
    TaskInstanceListDesktop,
    TaskInstanceListMobile,
  ],
})
export class TaskInstanceList implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  public dialogHandlerS = inject(DialogHandlerService);
  private dateS = inject(DateService);
  platformS = inject(PlatformService);
  data = signal<TaskInstance[]>([]);
  loading = signal(true);
  selectedDateControl = new FormControl<string>(this.dateS.getDateNow());

  ngOnInit(): void {
    this.selectedDateControl.valueChanges.subscribe(() => this.onLoadData());
    this.onLoadData();
  }

  onLoadData(): void {
    this.loading.set(true);
    const date = this.selectedDateControl.value || this.dateS.getDateNow();
    this.apiResponseS
      .onGetList<TaskInstance[]>(
        `recurring-tasks/instances/my-daily-tasks?date=${date}`,
      )
      .then((response) => {
        if (response) {
          this.data.set(response);
        } else {
          this.data.set([]);
        }
      })
      .finally(() => this.loading.set(false));
  }

  onCompleteTask(task: TaskInstance): void {
    this.dialogHandlerS
      .openDialog(
        CompleteTaskForm,
        { task },
        "Completar Tarea",
        this.dialogHandlerS.sizeMd,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onReopenTask(id: string): void {
    this.apiResponseS
      .onPost<any>(`recurring-tasks/instances/${id}/reopen`, {})
      .then((result) => {
        if (result) {
          this.onLoadData();
        }
      });
  }
}
