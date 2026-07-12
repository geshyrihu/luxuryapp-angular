import { Endpoints } from "src/app/core/constants/endpoints";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { AppAvatar } from "@ui/web/avatar/avatar";
import { Mesanio } from "@ui/web/mesanio/mesanio";
import { TableModule } from "primeng/table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { PeriodMonthService } from "src/app/core/services/periodo-month.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";

import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
@Component({
  selector: "app-reporte-tickets",
  templateUrl: "./reporte-tickets.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    AppAvatar,
    LxTag,
    CustomInputTextSignal,
    Mesanio,
  ],
})
export class ReporteTickets {
  apiResponseS = inject(ApiResponseService);
  dateS = inject(DateService);
  PeriodMonthService = inject(PeriodMonthService);
  customerIdS = inject(CustomerIdService);
  tableScrollHeightS = inject(TableScrollHeightService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onFiltrarPeriodo(periodo: string) {
    this.PeriodMonthService.setPeriodo(periodo);
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = Endpoints.RefactorOperations.resumenGeneralReporteResumenTicketByIdByIdById(this.customerIdS.customerId(), this.dateS.getDateFormat(
      this.PeriodMonthService.getPeriodoInicio,
    ), this.dateS.getDateFormat(this.PeriodMonthService.getPeriodoFin));
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  onSumaTotales(data: any[]) {
    let solicitudes = 0;
    let atendidas = 0;
    let pendientes = 0;

    (data ?? []).forEach((resp) => {
      solicitudes += resp.solicitudes;
      atendidas += resp.atendidas;
      pendientes += resp.pendientes;
    });

    return { solicitudes, atendidas, pendientes };
  }
}
