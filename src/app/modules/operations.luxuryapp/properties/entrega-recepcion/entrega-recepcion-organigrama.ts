import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { TreeNode } from "@ui/web/primeng-api/primeng-api";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
@Component({
  selector: "app-entrega-recepcion-organigrama",
  templateUrl: "./entrega-recepcion-organigrama.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [],
})
export class EntregaRecepcionOrganigrama {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dataSignal = signal<TreeNode[]>([]);

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }
  onLoadData() {
    const urlApi = Endpoints.EntregaRecepcionReports.organizationChartByCustomer(
      this.customerIdS.customerId(),
    );
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }
}
