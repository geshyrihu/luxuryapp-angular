import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { LxConfirmDialog } from "@ui/adaptive/confirm-dialog/confirm-dialog";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MessageService } from "@core/services/message.service";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "@core/helpers/table-primeng-option";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { ApiDatePipe } from "../../../../shared/pipes/api-date.pipe";
import { AdminVacacionesEditModalComponent } from "./modal-admin-vacaciones-edit";

import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { VacationBalanceAdminViewDto } from "../../interfaces/vacation-balance-admin-view.interface";
@Component({
  selector: "app-admin-vacaciones-balance",
  imports: [
    AppIcon,
    MobileListItem,
    WebButtonIconEdit,
    PrimeNgCustomTableEmptyMessage,
    ApiDatePipe,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    WebButtonLabel,
    LxTag,
    PrimeNgCustomCaption,
    WebButtonLabelEdit,
    DataViewMobile,
    LxConfirmDialog,
  ],
  templateUrl: "./admin-vacaciones-balance.html",
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class AdminVacacionesBalance {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  confirmS = inject(ConfirmService);
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

  async onRecalculateAll() {
    const customerId: string = this.customerIdS.customerId();
    if (!customerId) return;

    const ok = await this.confirmS.confirm(
      "óEstés seguro de recalcular todos los balances de vacaciones para este cliente? Esta acción corregiré los días totales de cada empleado segón su antigóedad actual. Esta acción no se puede deshacer.",
      "Confirmación",
    );
    if (!ok) return;

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
