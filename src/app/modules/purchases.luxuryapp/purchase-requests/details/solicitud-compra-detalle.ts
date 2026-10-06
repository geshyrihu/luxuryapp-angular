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
import { SolicitudCompraService } from "@purchases.luxuryapp/purchase-requests/requests/services/solicitud-compra.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { ButtonWeb } from "@ui/buttons/web";

import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";
import { ProductoEdit } from "./producto-edit";

@Component({
  selector: "app-solicitud-compra-detalle",
  templateUrl: "./solicitud-compra-detalle.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ButtonWeb,
    TableEmptyMessage,
    AppTable],
})
export class SolicitudCompraDetalle {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  solicitudCompraService = inject(SolicitudCompraService);
  confirmS = inject(ConfirmService);
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
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onUpdateData();
      });
  }
  onUpdateData() {
    this.updateData.emit();
  }

  async onDeleteProduct(id: any) {
    const ok = await this.confirmS.confirm(
      "¿Está seguro de eliminar este producto de la solicitud?",
    );
    if (!ok) return;
    this.apiResponseS
      .onDelete(Endpoints.PurchaseRequestDetails.delete(id))
      .then(() => {
        this.onUpdateData();
        this.solicitudCompraService.onDeleteProduct();
      });
  }
}
