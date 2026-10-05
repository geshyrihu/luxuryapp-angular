import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { CustomToastService } from "@core/services/custom-toast.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { TaskFollowup } from "../task-follow-up/task-followup";
import { TaskForm } from "../task-message/task-form";
import { TaskGroupService } from "../task.service";
import { MyRequestsTaskDesktop } from "./desktop/my-requests-task-desktop";
import { MyRequestsTaskMobile } from "./mobile/my-requests-task-mobile";

@Component({
  selector: "app-my-requests-task",
  templateUrl: "./my-requests-task.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MyRequestsTaskDesktop, MyRequestsTaskMobile],
})
export class MyRequestsTask implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  dialogHandlerS = inject(DialogHandlerService);
  TaskGroupService = inject(TaskGroupService);
  customerIdS = inject(CustomerIdService);
  customToastService = inject(CustomToastService);
  activatedRoute = inject(ActivatedRoute);
  platformS = inject(PlatformService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  status: string = this.TaskGroupService.taskGroupMessageStatus;

  ngOnInit() {
    this.onLoadData(this.status);
  }

  onLoadData(status: any) {
    this.loading.set(true);
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
      })
      .catch(() => undefined)
      .finally(() => this.loading.set(false));
  }

  onFollowUp(id: string) {
    this.dialogHandlerS
      .openDialog(
        TaskFollowup,
        { id: id },
        "Seguimiento",
        this.dialogHandlerS.sizeXl,
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
        this.dialogHandlerS.sizeXl,
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
        TaskForm,
        { id: data.id, ticketGroupId: data.ticketGroupId },
        data.title,
        this.dialogHandlerS.sizeXl,
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
