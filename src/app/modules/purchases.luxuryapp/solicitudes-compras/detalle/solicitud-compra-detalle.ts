import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { SolicitudCompraService } from "@core/services/solicitud-compra.service";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { AppTable } from "@ui/web/table/table";
import { ProductoEdit } from "./producto-edit";

@Component({
  selector: "app-solicitud-compra-detalle",
  templateUrl: "./solicitud-compra-detalle.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconEdit,
    WebButtonIconDelete,
    PrimeNgCustomTableEmptyMessage,
    AppTable,
  ],
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
