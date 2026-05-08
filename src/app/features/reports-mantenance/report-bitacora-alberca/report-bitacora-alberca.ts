import { Component, effect, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomBarChart } from "src/app/core/components/charts/custom-bar-chart";
import { PageTitleReport } from "src/app/core/components/title-page-report/page-title-report";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";
import { PeriodMonthService } from "src/app/core/services/periodo-month.service";
@Component({
  selector: "app-report-bitacora-alberca",
  templateUrl: "./report-bitacora-alberca.html",
  imports: [CustomBarChart, PageTitleReport],
})
export class ReportBitacoraAlberca {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dateS = inject(DateService);
  public PeriodMonthService = inject(PeriodMonthService);
  medidores = signal<any[]>([]);
  title: string = "";
  ref: DynamicDialogRef;

  periodoInicial = toSignal(this.PeriodMonthService.getPeriodoInicial$());

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      const pInicial = this.periodoInicial();

      if (customerId) {
        this.onLoadData();
      }
    });
  }

  onLoadData() {
    const urlApi = `MaintenanceReport/bitacoraalbercaparametros/${this.customerIdS.customerId()}/${this.dateS.getDateFormat(
      this.PeriodMonthService.getPeriodoInicio,
    )}`;
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.medidores.set(result);
    });
  }
}









