import { Component, effect, inject, signal } from "@angular/core";
import {
    globalFilterFields,
    rowsPerPageOptions,
    tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { ReportHeader } from "@ui/web/report-header/report-header";
import { SanitizeHtmlPipe } from "src/app/core/pipes/sanitize-html.pipe";
@Component({
  selector: "app-entrega-recepcion-mantenimientos-pendientes",
  templateUrl: "./entrega-recepcion-mantenimientos-pendientes.html",
  imports: [ReportHeader, SanitizeHtmlPipe],
})
export class EntregaRecepcionMantenimientosPendientes {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  data: any[] = [];

  globalFilterFields: string[] = [];
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }
  onLoadData() {
    const urlApi = `'EntregaRecepcion/Pendientes/${this.customerIdS.customerId()}`;
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.data = result;

      this.globalFilterFields = globalFilterFields(this.data);
    });
  }

  calcularEquiposTotal(name) {
    let total = 0;

    if (this.data) {
      for (let customer of this.data) {
        if (customer.clasificacion === name) {
          total++;
        }
      }
    }

    return total;
  }
}









