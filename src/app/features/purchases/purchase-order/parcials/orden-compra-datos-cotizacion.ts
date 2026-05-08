import { Component, EventEmitter, Input, Output } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CardModule } from "primeng/card";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
@Component({
  selector: "app-orden-compra-datos-cotizacion",
  templateUrl: "./orden-compra-datos-cotizacion.html",
  imports: [RouterModule, CustomButton, CardModule],
})
export class OrdenCompraDatosCotizacion {
  @Input() ordenCompra: any;
  @Input() bloqueada: boolean;
  @Input() solicitudCompraId: string = "";
  @Output() modalOrdenCompra: EventEmitter<string> = new EventEmitter();
  onModalOrdenCompra() {
    this.modalOrdenCompra.emit();
  }
}









