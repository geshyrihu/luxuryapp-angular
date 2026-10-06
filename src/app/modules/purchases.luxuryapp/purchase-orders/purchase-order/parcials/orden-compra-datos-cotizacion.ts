import { ButtonWeb } from "@ui/buttons/web";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { PurchaseOrderView } from "../purchase-order.types";

@Component({
  selector: "app-orden-compra-datos-cotizacion",
  templateUrl: "./orden-compra-datos-cotizacion.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ButtonWeb, RouterModule, LxIcon],
})
export class OrdenCompraDatosCotizacion {
  ordenCompra = input<PurchaseOrderView>();
  bloqueada = input<boolean>();
  solicitudCompraId = input<string>("");
  modalOrdenCompra = output<void>();
  onModalOrdenCompra() {
    this.modalOrdenCompra.emit();
  }
}
