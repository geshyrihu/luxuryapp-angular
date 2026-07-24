import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomInputSwitch } from "@ui/inputs/web/custom-input-switch-signal";
import { AppImage } from "@ui/web/image/image";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { MenuModule } from "@ui/web/primeng-menu/primeng-menu";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { SendOperationReport } from "src/app/apps/operations.luxuryapp/task-engine/tasks/send-operation-report/send-operation-report";
import { TaskDateRangeSelector } from "src/app/apps/operations.luxuryapp/task-engine/tasks/task-date-range-selector/task-date-range-selector";
import { TaskReportActions } from "src/app/apps/operations.luxuryapp/task-engine/tasks/task-report-actions/task-report-actions";
import { TaskStatus } from "src/app/apps/operations.luxuryapp/task-engine/tasks/task-status/task-status";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ROUTES } from "src/app/routing/route-paths";

import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { WebButtonIconTracking } from "@ui/buttons/web-icon/button-tracking";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { TaskGroupService } from "src/app/apps/operations.luxuryapp/task-engine/tasks/task.service";
import { TaskClose } from "../task-close";
import { TaskFollowup } from "../task-follow-up/task-followup";
import { EITaskMessageDTOStatus } from "../task-message-status.enum";
import { TaskForm } from "../task-message/task-form";
import { TaskReadList } from "../task-read-list";

@Component({
  selector: "app-task-operation-report",
  templateUrl: "./task-operation-report.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    DataViewMobile,
    MobileListItem,
    MobileActionMenu,
    MobileButtonLabelItem,
    WebButtonIconTracking,
    TaskStatus,
    TaskReportActions,
    TaskDateRangeSelector,
    TableModule,

    PrimeNgCustomCaption,
    MenuModule,
    PrimeNgCustomCaption,
    AppImage,
    CustomInputSwitch,
    ReactiveFormsModule,
  ],
})
export class TaskMessageOperationReport {
  onProgram(arg0: any) {
    throw new Error("Method not implemented");
  }
  onProgress(arg0: any) {
    throw new Error("Method not implemented");
  }
  onReopen(arg0: any) {
    throw new Error("Method not implemented");
  }
  onDelete(_t42: any) {
    throw new Error("Method not implemented");
  }
  activatedRoute = inject(ActivatedRoute);
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  customToastService = inject(CustomToastService);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);
  TaskGroupService = inject(TaskGroupService);
  router = inject(Router);
  status: EITaskMessageDTOStatus = EITaskMessageDTOStatus.Cerrado;
  startDate: string | null = null;
  endDate: string | null = null;
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  assignee: string | null = null;
  cb_assignee: SelectItemDto[] = [];
  ticketGroupId: string = this.activatedRoute.snapshot.params.ticketGroupId;

  onLoadData() {
    this.TaskGroupService.setStatus(this.status);

    this.apiResponseS
      .onGetList(
        Endpoints.TaskReports.weeklyReport(
          this.customerIdS.customerId(),
          this.startDate,
          this.endDate,
          this.status,
        ),
      )
      .then((result: any) => {
        const data = result.map((item: any) => ({
          ...item,
          isRelevantControl: new FormControl(item.isRelevant),
        }));
        this.dataSignal.set(data);
      });
  }

  onDateRangeSelected(event: { startDate: Date; endDate: Date }) {
    // Convierte las fechas a formato ISO
    const startDateFormatted = event.startDate.toISOString(); // Formato: '2024-09-30T00:00:00.000Z'
    const endDateFormatted = event.endDate.toISOString(); // Formato: '2024-10-17T00:00:00.000Z'

    this.startDate = startDateFormatted;
    this.endDate = endDateFormatted;

    // Aqué puedes usar las fechas seleccionadas para obtener el reporte de tickets
    this.onLoadData();
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        TaskForm,
        { id: data.id, ticketGroupId: this.ticketGroupId },
        "Agregar",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }
  onChangeStatus(value: any) {
    this.status = value;
    this.onLoadData();
  }

  onView(id: string) {
    this.dialogHandlerS
      .openDialog(
        TaskReadList,
        { id: id },
        "Vistas",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onClosed(id: string) {
    this.dialogHandlerS
      .openDialog(
        TaskClose,
        { id: id },
        "Cerrar ticket",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  // Actualizar si el item es relevante o no
  onUpdateStateTicket(item: any) {
    this.apiResponseS
      .onGetItem(Endpoints.Tasks.updateRelevanceLegacy(item.id))
      .then(() => {
        // this.customToastService.onShowSuccess();
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
        if (result) this.onLoadData();
      });
  }

  onPreviewClicked(): void {
    // Lígica para la vista previa
    this.router.navigate(ROUTES.TICKETS.REPORTE_SEMANAL_VISTA);
  }
  onSendReportClicked(): void {
    // Lígica para enviar el reporte
    this.dialogHandlerS
      .openDialog(
        SendOperationReport,
        {},
        "Envio de reporte semanal",
        this.dialogHandlerS.sizeFull,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
