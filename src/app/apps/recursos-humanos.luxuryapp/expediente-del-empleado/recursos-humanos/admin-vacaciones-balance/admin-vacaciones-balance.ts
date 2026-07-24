import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { LxConfirmDialog } from "@ui/adaptive/confirm-dialog/confirm-dialog";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { ConfirmationService, MessageService } from "@ui/web/primeng-api/primeng-api";
import { DynamicDialogModule } from "@ui/web/primeng-dynamicdialog/primeng-dynamicdialog";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { AdminVacacionesEditModalComponent } from "./modal-admin-vacaciones-edit";

import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { VacationBalanceAdminViewDto } from "../interfaces/vacation-balance-admin-view.interface";
@Component({
  selector: "app-admin-vacaciones-balance",
  imports: [
    AppIcon,
    MobileListItem,
    WebButtonIconEdit,
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    TableModule,
    WebButtonLabel,
    LxTag,
    DynamicDialogModule,
    PrimeNgCustomCaption,
    WebButtonLabelEdit,
    DataViewMobile,
    LxConfirmDialog,
  ],
  templateUrl: "./admin-vacaciones-balance.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [ConfirmationService, MessageService],
})
export class AdminVacacionesBalance {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  tableScrollHeightS = inject(TableScrollHeightService);
  loading = signal(true);
  dataSignal = signal<VacationBalanceAdminViewDto[]>([]);

  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return ["fullName", "hireDate", "seniorityYears"];
  });
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData(customerId);
    });
  }

  onLoadData(customerId: string): void {
    this.loading.set(true);
    this.apiResponseS
      .onGetList<VacationBalanceAdminViewDto[]>(
        Endpoints.HR.VacationBalanceAdmin.byCustomer(customerId),
      )
      .then((resp) => {
        this.dataSignal.set(resp ?? []);
        this.loading.set(false);
      });
  }

  onRecalculateAll() {
    const customerId: string = this.customerIdS.customerId();
    if (!customerId) return;

    this.confirmationService.confirm({
      message:
        "óEstés seguro de recalcular todos los balances de vacaciones para este cliente? Esta acción corregiré los días totales de cada empleado segón su antigóedad actual. Esta acción no se puede deshacer.",
      header: "Confirmación",
      icon: "mdi:alert",
      accept: () => {
        this.loading.set(true);
        this.apiResponseS
          .onPost<boolean>(
            Endpoints.HR.VacationBalanceAdmin.recalculateAll(customerId),
            {},
          )
          .then((result) => {
            this.messageService.add({
              severity: result ? "success" : "warn",
              summary: result ? "Completado" : "Atención",
              detail: result
                ? "Los balances de vacaciones se recalcularon correctamente."
                : "No se pudo completar el recólculo de balances.",
            });
            this.onLoadData(customerId);
          })
          .catch(() => this.loading.set(false));
      },
    });
  }

  getSeverity(isDiscrepant: boolean): string {
    return isDiscrepant ? "danger" : "success";
  }

  openEditModal(employeeData: VacationBalanceAdminViewDto): void {
    this.dialogHandlerS
      .openDialog(
        AdminVacacionesEditModalComponent,
        {
          employeeId: employeeData.employeeId,
          fullName: employeeData.fullName,
          currentSystemBalance: employeeData.currentSystemBalance,
        },
        "Actualizar Saldo Manualmente",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          const customerId: string = this.customerIdS.customerId();
          this.onLoadData(customerId);
        }
      });
  }
}
