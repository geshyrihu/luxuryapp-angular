import { CommonModule } from "@angular/common";
import { Component, effect, inject, signal, ChangeDetectionStrategy } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { AvatarModule } from "primeng/avatar";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PageTitleReportMaintenance } from "@ui/web/title-page-report-maintenance/page-title-report-maintenance";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";
import { PeriodMonthService } from "src/app/core/services/periodo-month.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
@Component({
  selector: "app-report-ticket",
  templateUrl: "./report-ticket.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    TableModule,
    AvatarModule,
    PageTitleReportMaintenance,
    PrimeNgCustomCaption,
  ],
})
export class ReportTicket {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  customToastService = inject(CustomToastService);
  dateS = inject(DateService);
  PeriodMonthService = inject(PeriodMonthService);
  tableScrollHeightS = inject(TableScrollHeightService);
  dataSignal = signal<any[]>([]);
  // Si estas otras tambión son datos para la UI, las podemos convertir a signals
  dataResponsable = signal<any>(null);
  dataCargaTicket = signal<any>(null);

  ref: DynamicDialogRef;
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  // PERIOD SIGNAL
  periodoInicial = toSignal(this.PeriodMonthService.getPeriodoInicial$());

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      const pInicial = this.periodoInicial(); // Suscripción reactiva

      if (customerId) {
        this.onLoadData();
      }
    });
  }

  onLoadData() {
    // Usamos el valor actual del servicio (que debería estar sincronizado)
    const periodo = this.dateS.getDateFormat(
      this.PeriodMonthService.getPeriodoInicio,
    );
    const customerId: string = this.customerIdS.customerId();

    const urlApi = `MaintenanceReport/ticket/${customerId}/${periodo}`;

    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));

    const urlApi2 = `MaintenanceReport/TicketResponsable/${customerId}/${periodo}`;
    this.apiResponseS.onGetList(urlApi2).then((result: any) => {
      this.dataResponsable.set(result);
    });

    const urlApi3 = `MaintenanceReport/CargaTicket/${customerId}/${periodo}`;
    this.apiResponseS.onGetList(urlApi3).then((result: any) => {
      this.dataCargaTicket.set(result);
    });
  }

  onSumaTotales(data: any[]) {
    let solicitudes = 0;
    let atendidas = 0;
    let pendientes = 0;
    let noAutorizado = 0;

    data.forEach((resp) => {
      solicitudes += resp.solicitudes;
      atendidas += resp.atendidas;
      pendientes += resp.pendientes;
      noAutorizado += resp.noAutorizado;
    });

    return {
      solicitudes,
      atendidas,
      pendientes,
      noAutorizado,
    };
  }
}









