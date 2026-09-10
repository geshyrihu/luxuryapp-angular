import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { CustomBarChart } from "@ui/web/charts/custom-bar-chart";
import { PageTitleReport } from "@ui/web/title-page-report/page-title-report";
import { DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { PeriodMonthService } from "src/app/core/services/periodo-month.service";
@Component({
  selector: "app-report-bitacora-alberca",
  templateUrl: "./report-bitacora-alberca.html",
  changeDetection: ChangeDetectionStrategy.Eager,
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
    const urlApi =
      Endpoints.RefactorMantenimiento.maintenanceReportBitacoraalbercaparametrosByIdById(
        this.customerIdS.customerId(),
        this.dateS.getDateFormat(this.PeriodMonthService.getPeriodoInicio),
      );
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.medidores.set(result);
    });
  }
}
