import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { MessageService } from "@core/services/message.service";
import { PlatformService } from "@core/services/platform.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { AdminVacacionesBalanceDesktop } from "./desktop/admin-vacaciones-balance-desktop";
import { AdminVacacionesBalanceMobile } from "./mobile/admin-vacaciones-balance-mobile";
import { AdminVacacionesEditModalComponent } from "./modal-admin-vacaciones-edit";
import { VacationBalanceAdminViewDto } from "../../interfaces/vacation-balance-admin-view.interface";

@Component({
  selector: "app-admin-vacaciones-balance",
  imports: [AdminVacacionesBalanceDesktop, AdminVacacionesBalanceMobile],
  templateUrl: "./admin-vacaciones-balance.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminVacacionesBalance {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  confirmS = inject(ConfirmService);
  messageService = inject(MessageService);
  platformS = inject(PlatformService);
  loading = signal(true);
  dataSignal = signal<VacationBalanceAdminViewDto[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return ["fullName", "hireDate", "seniorityYears"];
  });

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
      "óEstés seguro de recalcular todos los balances de vacaciones para este cliente? Esta acción corregiré los días totales de cada empleado según su antigóedad actual. Esta acción no se puede deshacer.",
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
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) {
          const customerId: string = this.customerIdS.customerId();
          this.onLoadData(customerId);
        }
      });
  }
}
