import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";
import { Component, input, output } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
@Component({
  selector: "app-orden-compra-datos-pago-parcial",
  templateUrl: "./orden-compra-datos-pago-parcial.html",
  imports: [ButtonModule, TagModule, TooltipModule, AppIcon],
})
export class OrdenCompraDatosPagoParcial {
  ordenCompra = input<any>();
  bloqueada = input<boolean>();
  modalOrdenCompra = output<void>();
  onModalOrdenCompraDatosPago() {
    this.modalOrdenCompra.emit();
  }
}









