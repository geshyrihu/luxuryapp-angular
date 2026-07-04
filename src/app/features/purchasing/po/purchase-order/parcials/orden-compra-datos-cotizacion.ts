import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { Component, input, output } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { WebButtonIcon } from "src/app/core/components/buttons/web-icon/button";
@Component({
  selector: "app-orden-compra-datos-cotizacion",
  templateUrl: "./orden-compra-datos-cotizacion.html",
  imports: [RouterModule, ButtonModule, TooltipModule, AppIcon, WebButtonIcon],
})
export class OrdenCompraDatosCotizacion {
  ordenCompra = input<any>();
  bloqueada = input<boolean>();
  solicitudCompraId = input<string>("");
  modalOrdenCompra = output<void>();
  onModalOrdenCompra() {
    this.modalOrdenCompra.emit();
  }
}









