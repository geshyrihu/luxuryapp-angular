import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { ToolbarModule } from "primeng/toolbar";
import {
  WebButtonLabelConfirm,
  WebButtonLabelItem,
} from "@ui/buttons/web-label";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { StatusBadge } from "@ui/web/status-badge/status-badge";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TaskInstance } from "src/app/core/models/recurring-tasks/task-instance.model";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { CompleteTaskForm } from "../complete-task-form/complete-task-form";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileButtonLabelConfirm } from "@ui/buttons/mobile-label/button-confirm";

import { WebButtonIconConfirm } from "@ui/buttons/web-icon/button-confirm";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";

@Component({
  selector: "app-task-instance-list",
  templateUrl: "./task-instance-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIcon,
    WebButtonIconConfirm,
    MobileActionMenu,
    MobileButtonLabelItem,
    MobileButtonLabelConfirm,
    PrimeNgCustomTableEmptyMessage,
    ActionMenu,
    CommonModule,
    WebButtonLabel,
    WebButtonLabelConfirm,
    WebButtonLabelItem,
    DataViewMobile,
    CustomInputDateSignal,
    ReactiveFormsModule,
    StatusBadge,
    TableModule,
    ToolbarModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,

    WebButtonLabelConfirm,
    WebButtonLabelItem,
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
