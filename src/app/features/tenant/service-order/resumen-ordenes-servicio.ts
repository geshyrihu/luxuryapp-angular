import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";
import { ReporteOrdenesServicioService } from "src/app/core/services/reporte-ordenes-servicio.service";
import { ResumenOrdenesServicioGrafico } from "./resumen-ordenes-servicio-grafico";
@Component({
  selector: "app-resumen-ordenes-servicio",
  templateUrl: "./resumen-ordenes-servicio.html",
  imports: [CommonModule, TableModule, ResumenOrdenesServicioGrafico, TagModule],
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
  tablePrimeNgRows: number = tablePrimeNgRows();
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
    const urlApi =
      "MeetingDertailsSeguimiento/ResumenPreventivosPresentacion/" +
      this.customerId +
      "/" +
      this.dateS.getDateFormat(this.reporteOrdenesServicioService.getDate());
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));

    const urlApi2 =
      "MeetingDertailsSeguimiento/ResumenPreventivosGraficoPresentacion/" +
      this.customerId +
      "/" +
      this.dateS.getDateFormat(this.reporteOrdenesServicioService.getDate());
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









