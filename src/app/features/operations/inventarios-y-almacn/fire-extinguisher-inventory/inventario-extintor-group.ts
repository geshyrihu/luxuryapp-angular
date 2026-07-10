import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
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
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi =
      "InventarioExtintor/GetAllGroup/" + this.customerIdS.customerId;
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.data = result;

      this.globalFilterFields = globalFilterFields(this.data);
    });
  }
}
