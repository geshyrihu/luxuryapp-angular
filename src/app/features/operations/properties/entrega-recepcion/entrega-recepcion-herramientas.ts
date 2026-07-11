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
import { TableModule } from "primeng/table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ReportHeader } from "@ui/web/report-header/report-header";
@Component({
  selector: "app-entrega-recepcion-herramientas",
  templateUrl: "./entrega-recepcion-herramientas.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReportHeader,TableModule, FormsModule, CustomInputCheckSignal],
})
export class EntregaRecepcionHerramientas {
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
    const urlApi = `EntregaRecepcion/InventarioHerramientas/${this.customerIdS.customerId()}`;
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
