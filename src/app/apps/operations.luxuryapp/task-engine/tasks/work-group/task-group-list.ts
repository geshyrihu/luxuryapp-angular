import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { CustomSearchInput } from "@ui/inputs/web/custom-search-input-signal";
import { EmptyState } from "@ui/web/empty-state/empty-state";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { DataViewModule } from "@ui/web/primeng-dataview/primeng-dataview";
import { addIcons } from "ionicons";
import {
  chatbubblesOutline,
  lockClosedOutline,
  lockOpenOutline,
  mailOutline,
  peopleOutline,
} from "ionicons/icons";
import { TaskGroupParticipant } from "src/app/apps/operations.luxuryapp/task-engine/tasks/participants/task-group-participant";
import { TaskGroupService } from "src/app/apps/operations.luxuryapp/task-engine/tasks/task.service";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ROUTES } from "src/app/routing/route-paths";
import { EITaskMessageDTOStatus } from "../task-message-status.enum";
import { TaskGroupForm } from "./task-group-form";

import { MobileButtonLabelActiveDesactive } from "@ui/buttons/mobile-label/button-active-desactive";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { WebButtonIconActiveDesactive } from "@ui/buttons/web-icon/button-active-desactive";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";

import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { StatusBadge } from "@ui/web/status-badge/status-badge";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "app-task-group-list",
  templateUrl: "./task-group-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    LxTag,
    PrimeNgCustomCaption,
    StatusBadge,
    AppIcon,
    WebButtonIcon,
    WebButtonIconActiveDesactive,
    WebButtonIconItem,
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelActiveDesactive,
    MobileButtonLabelItem,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    EmptyState,
    CustomSearchInput,
    NgbDropdownModule,
    DataViewModule,
    PrimeNgCustomTableFooter,
    DataViewMobile,

    LxTooltipDirective,
  ],
})
export class TaskGroupList {
  authS = inject(AuthService);
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);
  router = inject(Router); // Injectamos Router.
  TaskGroupService = inject(TaskGroupService);
  aspRoleS = inject(AspRoleService);
  error: string = "";
  dataSignal = signal<any[]>([]);
  scrollHeight = this.tableScrollHeightS.scrollHeight;
  hasLegal = this.aspRoleS.roleSignal(ApplicationRole.Legal);
  hasSuperUsuario = this.aspRoleS.roleSignal(ApplicationRole.SuperUsuario);

  /*
  /PRIME NG TABLE OPTIONS
  */
  readonly globalFilterFields = computed(() =>
    globalFilterFields(this.dataSignal()),
  );
  readonly searchTerm = signal<string>("");
  readonly filteredData = computed(() => {
    const data = this.dataSignal();
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return data;

    const fields = this.globalFilterFields();
    return data.filter((item) =>
      fields.some((field) =>
        String(item[field] ?? "").toLowerCase().includes(term),
      ),
    );
  });
  loading = signal(true);
  readonly tablePrimeNgRows: number = tablePrimeNgRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  /*
  /PRIME NG TABLE OPTIONS
  */
  readonly value = signal<boolean>(true);

  constructor() {
    addIcons({
      chatbubblesOutline,
      peopleOutline,
      mailOutline,
      lockClosedOutline,
      lockOpenOutline,
    });
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData() {
    const customerId: string = this.customerIdS.customerId();
    const applicationUserId = this.authS.applicationUserId;

    this.loading.set(true);
    this.apiResponseS
      .onGetList(
        Endpoints.TaskGroups.list(customerId, this.value(), applicationUserId),
      )
      .then((result: any) => {
        this.dataSignal.set(result || []);
        this.loading.set(false);
      });
  }
  onChange(value: boolean) {
    this.value.set(value);
    this.onLoadData();
  }
  onToggleStatus(id: string) {
    this.apiResponseS
      .onPatch(Endpoints.TaskGroups.toggleStatus(id), null)
      .then(() => {
        this.onLoadData();
      });
  }
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(TaskGroupForm, data, data.title, this.dialogHandlerS.sizeLg)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalParticipants(data: any) {
    this.dialogHandlerS
      .openDialog(
        TaskGroupParticipant,
        data,
        "Integrantes del grupo",
        this.dialogHandlerS.sizeLg,
      )
      .then(() => {
        this.onLoadData();
      });
  }

  onNavigateMessage(
    ticketGroupId: string,
    taskGroupMessageStatus: EITaskMessageDTOStatus,
  ) {
    this.TaskGroupService.taskGroupMessageStatus = taskGroupMessageStatus;
    this.TaskGroupService.setStatus(taskGroupMessageStatus);
    const ticketGroupIdStr = ticketGroupId;
    this.router.navigate(ROUTES.TICKETS.MENSAJES(ticketGroupIdStr));
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(Endpoints.TaskGroups.delete(id))
      .then((result: boolean) => {
        if (result)
          this.dataSignal.set(
            this.dataSignal().filter((item) => item.id !== id),
          );
      });
  }

  SendReportPendingTicketGroupAsync(item: any) {
    this.apiResponseS
      .onPost(Endpoints.TaskGroups.sendReportPendingByGroup(item.id), null)
      .then((result: any) => {
        if (result) {
        }
      });
  }

  SendReportPendingTicketGroupAllAsync() {
    this.apiResponseS
      .onPost(Endpoints.TaskGroups.sendReportPendingAll, null)
      .then((result: any) => {
        if (result) {
        }
      });
  }
}
export interface WorkGroupDTO {
  id: string;
  nameGroup: string;
  customerId: string;
  customer: string;
  dateCreation: string;
  description: string;
  userCreate: string;
  visibility: string;
  emoji: string;
  color: string;
  TaskGroupParticipant: number;
  open: number;
  inProgress: number;
  closed: number;
  reopened: number;
  totalPending: number;
  active: boolean;
  isLegalGroup: boolean;
}
