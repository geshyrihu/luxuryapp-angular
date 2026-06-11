import { Component, computed, effect, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CheckboxModule } from "primeng/checkbox";
import { TableModule } from "primeng/table";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { ReportHeader } from "src/app/core/components/report-header/report-header";
import { StripTagsPipe } from "src/app/core/pipes/StripTags.pipe";
@Component({
  selector: "app-entrega-recepcion-instalaciones",
  templateUrl: "./entrega-recepcion-instalaciones.html",
  imports: [
    TableModule,
    ReportHeader,
    StripTagsPipe,
    FormsModule,
    CheckboxModule,
  ],
})
export class EntregaRecepcionInstalaciones {
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
    const urlApi = `EntregaRecepcion/InventarioInstalaciones/${this.customerIdS.customerId()}`;
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  calcularEquiposTotal(name) {
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
