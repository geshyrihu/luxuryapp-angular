import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { PurchaseOrderView } from "../purchase-order.types";

@Component({
  selector: "app-orden-compra-datos-cotizacion",
  templateUrl: "./orden-compra-datos-cotizacion.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterModule, AppIcon, WebButtonIcon],
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
