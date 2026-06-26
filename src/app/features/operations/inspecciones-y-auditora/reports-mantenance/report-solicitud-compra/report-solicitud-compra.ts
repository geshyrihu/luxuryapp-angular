import { Component, effect, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PageTitleReportMaintenance } from "src/app/core/components/title-page-report-maintenance/page-title-report-maintenance";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";
import { PeriodMonthService } from "src/app/core/services/periodo-month.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
@Component({
  selector: "app-report-solicitud-compra",
  templateUrl: "./report-solicitud-compra.html",
  imports: [TableModule, PageTitleReportMaintenance, PrimeNgCustomCaption],
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
    const urlApi = `MaintenanceReport/solicitudinsumos/${this.customerIdS.customerId()}/${this.dateS.getDateFormat(
      this.PeriodMonthService.getPeriodoInicio,
    )}`;
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.solicitudes.set(result.solicitudes);
      this.ordenesCompra.set(result.ordenesCompra);
    });
  }
}









