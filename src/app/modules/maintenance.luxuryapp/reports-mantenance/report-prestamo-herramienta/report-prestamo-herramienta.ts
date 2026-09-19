import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DateService } from "@core/services/date.service";
import { PeriodMonthService } from "@core/services/periodo-month.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
@Component({
  selector: "app-report-prestamo-herramienta",
  templateUrl: "./report-prestamo-herramienta.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AppTable,
    PageTitleReportMaintenance,
    TableCaption,
  ],
})
export class ReportPrestamoHerramienta {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dateS = inject(DateService);
  PeriodMonthService = inject(PeriodMonthService);
  tableScrollHeightS = inject(TableScrollHeightService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  tableRows: number = tableRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
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
      Endpoints.RefactorMantenimiento.maintenanceReportPresatamoherramientaByIdById(
        this.customerIdS.customerId(),
        this.dateS.getDateFormat(this.PeriodMonthService.getPeriodoInicio),
      );
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }
}
