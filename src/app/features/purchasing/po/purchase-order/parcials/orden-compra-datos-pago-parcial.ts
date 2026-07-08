import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { Component, input, output, ChangeDetectionStrategy } from "@angular/core";
import { ButtonModule } from "primeng/button";

import { TooltipModule } from "primeng/tooltip";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { LxTag } from "@ui/adaptive/tag/tag";
@Component({
  selector: "app-orden-compra-datos-pago-parcial",
  templateUrl: "./orden-compra-datos-pago-parcial.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ButtonModule, TooltipModule, AppIcon, WebButtonIcon, LxTag],
})
export class OrdenCompraDatosPagoParcial {
  ordenCompra = input<any>();
  bloqueada = input<boolean>();
  modalOrdenCompra = output<void>();
  onModalOrdenCompraDatosPago() {
    this.modalOrdenCompra.emit();
  }
}









