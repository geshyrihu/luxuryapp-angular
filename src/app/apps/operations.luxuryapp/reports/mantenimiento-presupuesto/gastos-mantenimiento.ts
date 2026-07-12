import { Endpoints } from "src/app/core/constants/endpoints";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { MantenimientoPreventivoForm } from "../../google-calendar/calendar/mantenimiento-preventivo/mantenimiento-preventivo-form";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
@Component({
  selector: "app-gastos-mantenimiento",
  templateUrl: "./gastos-mantenimiento.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AppIcon,TableModule],
})
export class GastosMantenimiento {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);
  data = signal<any[]>([]);

  globalFilterFields: string[] = [];
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
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
    const urlApi = Endpoints.RefactorOperations.budgetMaintenanceSummaryOfExpensesById(this.customerIdS.customerId());
    const urlApi2 = Endpoints.RefactorOperations.budgetMaintenanceResumengastosById(this.customerIdS.customerId());

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
