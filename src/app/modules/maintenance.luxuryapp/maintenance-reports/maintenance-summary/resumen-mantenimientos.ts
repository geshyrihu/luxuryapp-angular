import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { PageTitleReportMaintenance } from "@ui/web/title-page-report-maintenance/page-title-report-maintenance";
import { AppTable } from "@ui/web/table/table";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { CustomToastService } from "@core/services/custom-toast.service";
import { DateService } from "@core/services/date.service";
import { PeriodMonthService } from "@core/services/periodo-month.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
@Component({
  selector: "app-resumen-mantenimientos",
  templateUrl: "./resumen-mantenimientos.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AppTable, PageTitleReportMaintenance],
})
export class ResumenMantenimientos {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  customToastService = inject(CustomToastService);
  dateS = inject(DateService);
  PeriodMonthService = inject(PeriodMonthService);
  tableScrollHeightS = inject(TableScrollHeightService);
  dataSignal = signal<any>(null);
  dataProviderSignal = signal<any[]>([]);
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  periodoInicial = toSignal(this.PeriodMonthService.getPeriodoInicial$());

  constructor() {
    effect(() => {
      // Reaccionar a cambios en customerId o periodo
      const customerId: string = this.customerIdS.customerId();
      const pInicial = this.periodoInicial();

      if (customerId) {
        this.onLoadData();
      }
    });
  }

  onLoadData() {
    // Usamos el periodo actualizado
    const periodo = this.dateS.getDateFormat(
      this.PeriodMonthService.getPeriodoInicio,
    );
    const customerId: string = this.customerIdS.customerId();

    const urlApi =
      Endpoints.RefactorMantenimiento.maintenanceReportResumenByIdById(
        customerId,
        periodo,
      );
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));

    const urlApi2 =
      Endpoints.RefactorMantenimiento.maintenanceReportProveedorByIdById(
        customerId,
        periodo,
      );
    this.apiResponseS.onGetList(urlApi2).then((result: any) => {
      this.dataProviderSignal.set(result);
    });
  }
}
