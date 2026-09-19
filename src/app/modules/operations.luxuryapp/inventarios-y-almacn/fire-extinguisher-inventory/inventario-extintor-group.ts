import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
@Component({
  selector: "app-inventario-extintor-group",
  templateUrl: "./inventario-extintor-group.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [],
})
export class InventarioExtintorGroup {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  data: any[] = [];

  globalFilterFields: string[] = [];
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
    const urlApi = Endpoints.FireExtinguishers.groupedByCustomer(
      this.customerIdS.customerId(),
    );
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.data = result;

      this.globalFilterFields = globalFilterFields(this.data);
    });
  }
}

