import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";

import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { ReportHeader } from "@ui/web/report-header/report-header";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { StripTagsPipe } from "@shared/pipes/StripTags.pipe";
@Component({
  selector: "app-entrega-recepcion-equipos",
  templateUrl: "./entrega-recepcion-equipos.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AppTable,
    AppSortableColumn,
    AppSorticon,
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
  tableRows: number = tableRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }
  onLoadData() {
    const urlApi = Endpoints.EntregaRecepcionReports.equipmentInventoryByCustomer(
      this.customerIdS.customerId(),
    );
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

