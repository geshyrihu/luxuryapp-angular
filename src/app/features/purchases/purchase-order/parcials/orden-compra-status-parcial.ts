import { Component, input, output } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
@Component({
  selector: "app-orden-compra-status-parcial",
  templateUrl: "./orden-compra-status-parcial.html",
  imports: [ButtonModule, TagModule, TooltipModule],
})
export class OrdenCompraStatusParcial {
  ordenCompra = input<any>();
  mostrarTabla = input<boolean>();
  ordenCompraPresupuestoUtilizado = input<boolean>();
  bloqueada = input<boolean>();
  modalOrdenCompra = output<void>();

  onModalOrdenCompraStatus() {
    this.modalOrdenCompra.emit();
  }
}









