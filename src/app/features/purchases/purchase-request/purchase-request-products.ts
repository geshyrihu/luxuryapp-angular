import { IonButtonDelete } from "src/app/core/components/buttons/mobile/ion-button-delete";
import { IonButtonEdit } from "src/app/core/components/buttons/mobile/ion-button-edit";
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
@Component({
  selector: "app-purchase-request-products",
  templateUrl: "./purchase-request-products.html",
  imports: [IonButtonDelete, IonButtonEdit, 
    CommonModule,
    TableModule,
    ActionMenu,
    ],
})
export class PurchaseRequestProducts {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);
  @Input()
  products: any[] = [];
  @Input()
  purchaseRequestId: string = "";

  @Output()
  updateData = new EventEmitter<void>();

  @Output()
  editProductRequest = new EventEmitter<any>(); // Nuevo Output

  ref: DynamicDialogRef;
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  onModalForm(item: any) {
    // Emitimos el objeto 'item' completo.
    // El componente padre (PurchaseRequestDetailComponent) lo recibiró.
    this.editProductRequest.emit(item);
  }
  onUpdateData() {
    this.updateData.emit();
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(`purchaserequest/delete-product/${id}`)
      .then(() => {
        this.onUpdateData();
      });
  }
}









