import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { PurchaseOrderView } from "../purchase-order.types";

@Component({
  selector: "app-orden-compra-status-parcial",
  templateUrl: "./orden-compra-status-parcial.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ LxIcon, WebButtonIcon, LxTag],
})
export class OrdenCompraStatusParcial {
  ordenCompra = input<PurchaseOrderView>();
  mostrarTabla = input<boolean>();
  ordenCompraPresupuestoUtilizado = input<boolean>();
  bloqueada = input<boolean>();
  modalOrdenCompra = output<void>();

  onModalOrdenCompraStatus() {
    this.modalOrdenCompra.emit();
  }
}
