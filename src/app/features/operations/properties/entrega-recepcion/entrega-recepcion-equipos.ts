import { Component, computed, effect, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";

import { StripTagsPipe } from "src/app/core/pipes/StripTags.pipe";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { ReportHeader } from "@ui/web/report-header/report-header";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
@Component({
  selector: "app-entrega-recepcion-equipos",
  templateUrl: "./entrega-recepcion-equipos.html",
  imports: [
    TableModule,
    ReportHeader,
    FormsModule,
    CustomInputCheckSignal,
    StripTagsPipe,
  ],
})
export class EntregaRecepcionEquipos {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
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
    const urlApi = `entregarecepcion/inventarioequipos/${this.customerIdS.customerId()}`;
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  calcularEquiposTotal(name: string) {
    let total = 0;
    const data = this.dataSignal();
    if (data) {
      for (let customer of data) {
        if (customer.clasificacion === name) {
          total++;
        }
      }
    }
    return total;
  }
}
