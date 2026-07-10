import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { TreeNode } from "primeng/api";
import { TableModule } from "primeng/table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
@Component({
  selector: "app-entrega-recepcion-organigrama",
  templateUrl: "./entrega-recepcion-organigrama.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TableModule],
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
    const urlApi = `EntregaRecepcion/Organigrama/${this.customerIdS.customerId()}`;
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }
}
