import { Component, inject, input, output } from "@angular/core";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
@Component({
  selector: "app-purchase-request-products",
  templateUrl: "./purchase-request-products.html",
  imports: [
    PrimeNgCustomTableEmptyMessage,
    WebButtonLabelDelete,
    WebButtonLabelEdit,
    TableModule,
    ActionMenu,
  ],
})
export class PurchaseRequestProducts {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);
  products = input<any[]>([]);
  purchaseRequestId = input<string>("");

  updateData = output<void>();
  editProductRequest = output<any>();

  ref: DynamicDialogRef;
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  onModalForm(item: any) {
    // Emitimos el objeto 'item' completo.
    // El componente padre (PurchaseRequestDetailComponent) lo recibiré.
    this.editProductRequest.emit(item);
  }
  onUpdateData() {
    this.updateData.emit();
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(Endpoints.PurchaseRequests.deleteProduct(id))
      .then(() => {
        this.onUpdateData();
      });
  }
}
