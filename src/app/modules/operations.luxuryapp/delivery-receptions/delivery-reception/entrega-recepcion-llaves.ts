import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { ReportHeader } from "@ui/web/report-header/report-header";
import { AppTable } from "@ui/web/table/table";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
@Component({
  selector: "app-entrega-recepcion-llaves",
  templateUrl: "./entrega-recepcion-llaves.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AppTable, FormsModule, ReportHeader, CustomInputCheckSignal],
})
export class EntregaRecepcionLlaves {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  tableRows: number = tableRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }
  onLoadData() {
    const urlApi = Endpoints.EntregaRecepcionReports.keysInventoryByCustomer(
      this.customerIdS.customerId(),
    );
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  calcularEquiposTotal(name) {
    let total = 0;
    const data = this.dataSignal();
    if (data) {
      for (let customer of data) {
        if (customer.descripcion === name) {
          total++;
        }
      }
    }
    return total;
  }
}
