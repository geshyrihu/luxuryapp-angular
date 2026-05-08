import { Component, EventEmitter, Input, Output, inject } from "@angular/core";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { SolicitudCompraService } from "src/app/core/services/solicitud-compra.service";
import { ProductoEdit } from "./producto-edit";
@Component({
  selector: "app-solicitud-compra-detalle",
  templateUrl: "./solicitud-compra-detalle.html",
  imports: [TableModule, CustomButtonEdit, CustomButtonDelete],
})
export class SolicitudCompraDetalle {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  solicitudCompraService = inject(SolicitudCompraService);
  @Input()
  SolicitudCompraDetalle: any[] = [];
  @Input()
  solicitudCompraId: string = "";

  @Output()
  updateData = new EventEmitter<void>();
  ref: DynamicDialogRef;

  editProduct(data: any) {
    this.dialogHandlerS
      .openDialog(
        ProductoEdit,
        {
          solicitudCompraId: this.solicitudCompraId,
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
    this.apiResponseS.onDelete(`solicitudcompradetalle/${id}`).then(() => {
      this.onUpdateData();
      this.solicitudCompraService.onDeleteProduct();
    });
  }
}









