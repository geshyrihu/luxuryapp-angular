import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
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
import { ReporteOrdenesServicioService } from "@core/services/reporte-ordenes-servicio.service";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { ResumenOrdenesServicioGrafico } from "./resumen-ordenes-servicio-grafico";
@Component({
  selector: "app-resumen-ordenes-servicio",
  templateUrl: "./resumen-ordenes-servicio.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ApiDatePipe, AppTable, ResumenOrdenesServicioGrafico, LxTag],
})
export class ResumenOrdenesServicio implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dateS = inject(DateService);
  reporteOrdenesServicioService = inject(ReporteOrdenesServicioService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  tableRows: number = tableRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  dataGraficos: any[] = [];
  concluidos = 0;
  pendientes = 0;
  noAutorizados = 0;
  grafico: any;
  urlImg: string = "";

  customerId: string;

  ngOnInit(): void {
    this.customerId = this.customerIdS.customerId();
    this.onLoadData();
  }

  onLoadData() {
    const fecha = this.dateS.getDateFormat(
      this.reporteOrdenesServicioService.getDate(),
    );
    const urlApi = Endpoints.MeetingDetailsTracking.resumenPreventivos(
      this.customerId,
      fecha,
    );
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));

    const urlApi2 = Endpoints.MeetingDetailsTracking.resumenGrafico(
      this.customerId,
      fecha,
    );
    this.apiResponseS.onGetList(urlApi2).then((result: any) => {
      this.dataGraficos = result;
      this.reporteOrdenesServicioService.setDateGrafico(this.dataGraficos);
    });
  }

  getBadgeSeverity(status: number): any {
    switch (status) {
      case 0:
        return "danger";
      case 1:
        return "success";
      case 2:
        return "secondary";
      default:
        return "info";
    }
  }
}
