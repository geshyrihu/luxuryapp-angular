import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { AppTable } from "@ui/web/table/table";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { MantenimientoPreventivoForm } from "../../google-calendar/calendar/preventive-maintenance/mantenimiento-preventivo-form";
@Component({
  selector: "app-gastos-mantenimiento",
  templateUrl: "./gastos-mantenimiento.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AppIcon, AppTable],
})
export class GastosMantenimiento {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);
  data = signal<any[]>([]);

  globalFilterFields: string[] = [];
  loading = signal(true);
  tableRows: number = tableRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  resumenGastos = signal<any[]>([]);
  scrollHeight = this.tableScrollHeightS.scrollHeight;
  totalGasto = signal<number>(0);
  ref: DynamicDialogRef;

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }
  onLoadData() {
    this.loading.set(true);
    const urlApi = Endpoints.BudgetMaintenance.summaryOfExpensesByCustomer(
      this.customerIdS.customerId(),
    );
    const urlApi2 = Endpoints.BudgetMaintenance.resumenGastosByCustomer(
      this.customerIdS.customerId(),
    );

    Promise.all([
      this.apiResponseS.onGetList(urlApi),
      this.apiResponseS.onGetList(urlApi2),
    ])
      .then(([result1, result2]: [any, any]) => {
        this.data.set(result1?.items ?? []);
        this.globalFilterFields = globalFilterFields(this.data());
        this.totalGasto.set(result1?.totalGastos ?? 0);
        this.resumenGastos.set(result2 ?? []);
      })
      .catch(() => {
        this.data.set([]);
        this.resumenGastos.set([]);
      })
      .finally(() => {
        this.loading.set(false);
      });
  }
  onModalItem(item: any) {
    this.dialogHandlerS
      .openDialog(
        MantenimientoPreventivoForm,
        {
          id: item.id,
          task: "edit",
          idMachinery: item.idEquipo,
        },
        "Editar regitro",
        this.dialogHandlerS.sizeFull,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}

