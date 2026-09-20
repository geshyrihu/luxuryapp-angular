import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { TableCaption } from "@ui/web/table-caption/table-caption";
import { PageTitleReportMaintenance } from "@ui/web/title-page-report-maintenance/page-title-report-maintenance";
import { DynamicDialogRef } from "@core/services/dialog-handler.service";
import { AppTable } from "@ui/web/table/table";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DateService } from "@core/services/date.service";
import { PeriodMonthService } from "@core/services/periodo-month.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
@Component({
  selector: "app-report-solicitud-compra",
  templateUrl: "./report-solicitud-compra.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AppTable,
    PageTitleReportMaintenance,
    TableCaption,
  ],
})
export class ReportSolicitudCompra {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dateS = inject(DateService);
  PeriodMonthService = inject(PeriodMonthService);
  tableScrollHeightS = inject(TableScrollHeightService);
  solicitudes = signal<any>([]);
  ordenesCompra = signal<any>([]);

  dataProvider: any = [];
  ref: DynamicDialogRef;
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  periodoInicial = toSignal(this.PeriodMonthService.getPeriodoInicial$());

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      const pInicial = this.periodoInicial();

      if (customerId) this.onLoadData();
    });
  }
  onLoadData() {
    const urlApi =
      Endpoints.RefactorMantenimiento.maintenanceReportSolicitudinsumosByIdById(
        this.customerIdS.customerId(),
        this.dateS.getDateFormat(this.PeriodMonthService.getPeriodoInicio),
      );
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.solicitudes.set(result.solicitudes);
      this.ordenesCompra.set(result.ordenesCompra);
    });
  }
}
