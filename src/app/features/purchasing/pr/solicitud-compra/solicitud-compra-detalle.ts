import { Component, inject, input, output } from "@angular/core";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { SolicitudCompraService } from "src/app/core/services/solicitud-compra.service";
import { ProductoEdit } from "./producto-edit";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";

@Component({
  selector: "app-solicitud-compra-detalle",
  templateUrl: "./solicitud-compra-detalle.html",
  imports: [
    WebButtonIconEdit,
    WebButtonIconDelete,
    PrimeNgCustomTableEmptyMessage,TableModule, WebButtonLabelEdit, WebButtonLabelDelete],
})
export class SolicitudCompraDetalle {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  solicitudCompraService = inject(SolicitudCompraService);
  solicitudCompraDetalle = input<any[]>([], {
    alias: "SolicitudCompraDetalle",
  });
  solicitudCompraId = input<string>("");

  updateData = output<void>();
  ref: DynamicDialogRef;

  editProduct(data: any) {
    this.dialogHandlerS
      .openDialog(
        ProductoEdit,
        {
          solicitudCompraId: this.solicitudCompraId(),
          id: data.id,
        },
        "Editar Producto",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onUpdateData();
      });
  }
  onUpdateData() {
    this.updateData.emit();
  }

  onDeleteProduct(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.PurchaseRequestDetails.delete(id))
      .then(() => {
        this.onUpdateData();
        this.solicitudCompraService.onDeleteProduct();
      });
  }
}
