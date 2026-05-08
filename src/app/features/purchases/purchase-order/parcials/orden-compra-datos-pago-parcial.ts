import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CardModule } from "primeng/card";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
@Component({
  selector: "app-orden-compra-datos-pago-parcial",
  templateUrl: "./orden-compra-datos-pago-parcial.html",
  imports: [CustomButton, CardModule],
})
export class OrdenCompraDatosPagoParcial {
  @Input() ordenCompra: any;
  @Input() bloqueada: boolean;
  @Output() modalOrdenCompra: EventEmitter<string> = new EventEmitter();
  onModalOrdenCompraDatosPago() {
    this.modalOrdenCompra.emit();
  }
}









