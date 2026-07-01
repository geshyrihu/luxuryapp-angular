import { CommonModule } from "@angular/common";
import { Component, inject, input, output } from "@angular/core";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { WebButtonLabelDelete } from "src/app/core/components/buttons/web/label/button-delete";
import { WebButtonLabelEdit } from "src/app/core/components/buttons/web/label/button-edit";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { PrimeNgCustomTableEmptyMessage } from "src/app/core/components/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
@Component({
  selector: "app-purchase-request-products",
  templateUrl: "./purchase-request-products.html",
  imports: [
    PrimeNgCustomTableEmptyMessage,
    WebButtonLabelDelete,
    WebButtonLabelEdit,
    CommonModule,
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
    // El componente padre (PurchaseRequestDetailComponent) lo recibir�.
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
