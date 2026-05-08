import { Component, effect, inject, signal } from "@angular/core";
import { TreeNode } from "primeng/api";
import { TableModule } from "primeng/table";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
@Component({
  selector: "app-entrega-recepcion-organigrama",
  templateUrl: "./entrega-recepcion-organigrama.html",
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









