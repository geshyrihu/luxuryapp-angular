import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { PurchaseOrderPaymentData } from "../purchase-order.types";
@Component({
  selector: "app-orden-compra-datos-pago-parcial",
  templateUrl: "./orden-compra-datos-pago-parcial.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ LxIcon, WebButtonIcon, LxTag],
})
export class OrdenCompraDatosPagoParcial {
  ordenCompra = input<PurchaseOrderPaymentData>();
  bloqueada = input<boolean>();
  modalOrdenCompra = output<void>();
  onModalOrdenCompraDatosPago() {
    this.modalOrdenCompra.emit();
  }
}
