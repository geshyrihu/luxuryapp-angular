import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import { CardModule } from "primeng/card";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DynamicDialogModule } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ToastModule } from "primeng/toast";
import { CustomButton } from "src/app/core/components/web/buttons/custom-button";
import { CustomButtonEdit } from "src/app/core/components/web/buttons/custom-button-edit";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { Endpoints } from "src/app/core/constants/endpoints";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { VacationBalanceAdminViewDto } from "../interfaces/vacation-balance-admin-view.interface";
import { AdminVacacionesEditModalComponent } from "./modal-admin-vacaciones-edit";

@Component({
  selector: "app-admin-vacaciones-balance",
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    CustomButton,
    TagModule,
    DynamicDialogModule,
    PrimeNgCustomCaption,
    CustomButtonEdit,
    DataViewMobile,
    ToastModule,
    ConfirmDialogModule,
  ],
  templateUrl: "./admin-vacaciones-balance.html",
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
        "¿Estás seguro de recalcular todos los balances de vacaciones para este cliente? Esta acción corregirá los días totales de cada empleado según su antigüedad actual. Esta acción no se puede deshacer.",
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
                : "No se pudo completar el recálculo de balances.",
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

