import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { WebButtonLabelEdit, WebButtonLabelItem } from "@ui/buttons/web-label";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { AppImage } from "@ui/web/image/image";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { ChipModule } from "primeng/chip";
import { TableModule } from "primeng/table";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";

import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { TaskFollowup } from "../task-follow-up/task-followup";
import { TaskForm } from "../task-message/task-form";
import { TaskStatus } from "../task-status/task-status";
import { TaskGroupService } from "../task.service";
import { MyTaskForm } from "./my-task-form";

@Component({
  selector: "app-my-requests-task",
  templateUrl: "./my-requests-task.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelItem,
    TableModule,
    PrimeNgCustomCaption,
    DataViewMobile,
    ActionMenu,
    TaskStatus,
    AppImage,
    ChipModule,
    WebButtonLabelEdit,
    WebButtonLabelItem,
    MobileListItem,
    AppIcon,
  ],
})
export class MyRequestsTask implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  dialogHandlerS = inject(DialogHandlerService);
  TaskGroupService = inject(TaskGroupService);
  customerIdS = inject(CustomerIdService);
  customToastService = inject(CustomToastService);
  tableScrollHeightS = inject(TableScrollHeightService);
  activatedRoute = inject(ActivatedRoute);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  status: string = this.TaskGroupService.taskGroupMessageStatus;
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  ngOnInit() {
    this.onLoadData(this.status);
  }

  onLoadData(status: any) {
    this.apiResponseS
      .onGetList(
        Endpoints.Tasks.myRequests(
          this.authS.applicationUserId,
          status,
          this.customerIdS.customerId(),
        ),
      )
      .then((result: any) => {
        this.dataSignal.set(result);
        this.status = status;
      });
  }

  onFollowUp(id: string) {
    this.dialogHandlerS
      .openDialog(
        TaskFollowup,
        { id: id },
        "Seguimiento",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.status);
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        TaskForm,
        { id: data.id, ticketGroupId: data.ticketGroupId },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData(this.status);
        }
      });
  }

  onModalAdd(data: any) {
    this.dialogHandlerS
      .openDialog(
        MyTaskForm,
        { id: data.id, ticketGroupId: data.ticketGroupId },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData(this.status);
        }
      });
  }
  onUpdatePriority(id: string) {
    this.apiResponseS
      .onGetItem(
        Endpoints.Tasks.updatePriority(id, this.authS.applicationUserId),
      )
      .then((result: any) => {
        if (result) {
          this.dataSignal.update((currentData) => {
            const index = currentData.findIndex((item) => item.id === id);
            if (index !== -1) {
              const newData = [...currentData];
              const item = { ...newData[index] };
              item.priority = item.priority === "Alta" ? "Baja" : "Alta";
              newData[index] = item;
              return newData;
            }
            return currentData;
          });
        }
      });
  }
}
