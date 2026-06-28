import { EmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { DateService } from "src/app/core/services/date.service";
import { TableModule } from "primeng/table";
import { ToolbarModule } from "primeng/toolbar";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import {
  CustomButtonConfirm,
  CustomButtonItem,
} from "src/app/core/components/buttons/web";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { StatusBadge } from "src/app/core/components/shared/status-badge/status-badge";
import { TaskInstance } from "src/app/core/models/recurring-tasks/task-instance.model";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { CompleteTaskForm } from "../complete-task-form/complete-task-form";
@Component({
  selector: "app-task-instance-list",
  templateUrl: "./task-instance-list.html",
  imports: [
    EmptyState,
    ActionMenu,
    CommonModule,
    CustomButton,
    CustomButtonConfirm,
    CustomButtonItem,
    DataViewMobile,
    CustomInputDateSignal,
    ReactiveFormsModule,
    StatusBadge,
    TableModule,
    ToolbarModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,

    CustomButtonConfirm,
    CustomButtonItem,
  ],
})
export class TaskInstanceList implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  public dialogHandlerS = inject(DialogHandlerService);
  private tableScrollHeightS = inject(TableScrollHeightService);
  private dateS = inject(DateService);
  data = signal<TaskInstance[]>([]);
  loading = signal(true);
  selectedDateControl = new FormControl<string>(this.dateS.getDateNow());
  scrollHeight = this.tableScrollHeightS.scrollHeight;

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
          // onGetList returns T | null
          this.data.set(response);
        } else {
          this.data.set([]); // Set to empty array on error
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
        // onPost returns T | false
        if (result) {
          this.onLoadData();
          // Show success toast (handled by ApiResponseService)
        }
        // No else needed, error handling and toasts are done by ApiResponseService
      });
  }

}

